const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { build } = require(path.join(root, 'node_modules/esbuild'));
const { chromium, webkit } = require(path.join(root, 'node_modules/playwright'));

(async () => {
  const details = path.join(root, 'src/features/reader/book-details');
  const result = await build({
    stdin: { contents: `
      import React from 'react';
      import {createRoot} from 'react-dom/client';
      import {BookHero} from './components/BookHero/BookHero.jsx';
      import {BookDescription} from './components/BookDescription/BookDescription.jsx';
      const book = {id: 1, title: 'عنوان كتاب طويل لاختبار التفاف النص على الهاتف', authorName: 'مؤلف باسم طويل لاختبار العرض', totalReviews: 12345, coverImageUrl: 'https://cover.test/book.svg'};
      createRoot(document.getElementById('root')).render(
        <div className="apple-book-details-view" dir="rtl"><main className="apple-book-details-container">
          <BookHero book={book} /><BookDescription description={'رواية تستكشف الوحدة والذاكرة والحب. '.repeat(20)} />
        </main></div>
      );`, resolveDir: details, loader: 'jsx' },
    bundle: true, write: false, format: 'iife', loader: { '.css': 'empty' },
    plugins: [{ name: 'share-mock', setup(b) {
      b.onResolve({filter: /^@\/components\/common$/}, () => ({path: 'share', namespace: 'mock'}));
      b.onLoad({filter: /.*/, namespace: 'mock'}, () => ({contents: 'export const ShareMenu = ({children}) => children;'}));
    }}],
  });
  const engine = process.env.KTAB_TEST_BROWSER === 'webkit' ? webkit : chromium;
  const browser = await engine.launch({headless: true, ...(engine === chromium ? {executablePath: '/usr/bin/google-chrome'} : {})});
  try {
    for (const width of [320, 390, 430, 768, 1024, 1440]) {
      const page = await browser.newPage({viewport: {width, height: 844}});
      let releaseCover;
      const coverReady = new Promise(resolve => { releaseCover = resolve; });
      await page.route('https://cover.test/book.svg', async route => {
        await coverReady;
        await route.fulfill({contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="3000"/>'});
      });
      await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="root"></div>');
      await page.addStyleTag({content: '* {box-sizing:border-box} body {margin:0}'});
      for (const file of ['views/BookDetailsView.css', 'components/BookHero/BookHero.css', 'components/BookDescription/BookDescription.css']) {
        await page.addStyleTag({content: fs.readFileSync(path.join(details, file), 'utf8')});
      }
      await page.addScriptTag({content: result.outputFiles[0].text});
      await page.locator('.apple-book-hero').waitFor();
      const check = async () => {
        const b = await page.evaluate(() => {
          const rect = selector => {const r=document.querySelector(selector).getBoundingClientRect(); return {top:r.top,bottom:r.bottom,height:r.height};};
          return {hero:rect('.apple-book-hero'), cover:rect('.apple-book-hero__artwork-card'), meta:rect('.apple-book-hero__text-meta'), actions:rect('.apple-book-hero__actions'), desc:rect('.apple-book-desc'), width:document.documentElement.scrollWidth};
        });
        assert.ok(b.desc.top >= b.hero.bottom, `${width}: description overlaps hero`);
        assert.ok(b.actions.bottom <= b.hero.bottom, `${width}: actions overflow hero`);
        assert.ok(b.width <= width, `${width}: horizontal overflow`);
        if (width <= 768) {
          assert.ok(b.actions.top >= Math.max(b.cover.bottom, b.meta.bottom), `${width}: actions overlap cover/text`);
          assert.ok(Math.abs(b.cover.height - 172.8) < 2, `${width}: unstable cover height`);
        }
      };
      await check();
      releaseCover();
      await page.waitForFunction(() => document.querySelector('img').naturalWidth > 0);
      await check();
      await page.setViewportSize({width: width <= 768 ? 844 : 390, height: 430});
      await page.setViewportSize({width, height: 844});
      await check();
      console.log(`PASS ${width}px: loading, decoded cover, and resize`);
      await page.close();
    }
  } finally {await browser.close();}
})().catch(error => {console.error(error); process.exitCode = 1;});
