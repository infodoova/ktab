const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { build } = require(path.join(root, 'node_modules/esbuild'));
const { chromium, webkit } = require(path.join(root, 'node_modules/playwright'));

(async () => {
  const reader = path.join(root, 'src/features/reader/book-reader');
  const bundle = await build({
    stdin: { contents: `
      import React from 'react';
      import {createRoot} from 'react-dom/client';
      import {MemoryRouter} from 'react-router-dom';
      import {usePageImageGen} from ${JSON.stringify(path.join(reader, 'hooks/usePageImageGen.js'))};
      import {useReaderUIState} from ${JSON.stringify(path.join(reader, 'hooks/useReaderUIState.js'))};
      function Harness() {
        const ui = useReaderUIState({});
        const image = usePageImageGen({isOpen: ui.isImageGenActive});
        window.readerUI = ui; window.imageGen = image;
        return <div className={'ktab-book-display-root ' + (ui.isImageGenActive ? 'ktab-book-display-root--image-gen-active' : '')} onContextMenu={ui.handleContextMenu}>
          <button id="open" onClick={ui.handleOpenImageGen}>Open</button>
          <div className="ktab-3page-preview-wrapper"><div className="ktab-3page-preview-sheet"><div className="ktab-3page-preview-sheet__body">
            <article className="ktab-3page-section"><p id="excerpt" className="ktab-3page-section__text">هذه فقرة من الكتاب لتحديد النص ورسم المشهد</p><p className="ktab-3page-section__text">{'نص طويل للقراءة والتمرير '.repeat(300)}</p></article>
          </div></div></div>
          <aside className="ktab-mobile-slider-drawer"><button className="ktab-mobile-slider-handle">›</button></aside>
          <span id="outside">Toolbar outside the excerpt</span>
        </div>;
      }
      createRoot(document.getElementById('root')).render(<MemoryRouter><Harness /></MemoryRouter>);
    `, resolveDir: root, loader: 'jsx' },
    bundle: true, write: false, format: 'iife',
    plugins: [{ name: 'reader-mocks', setup(b) {
      b.onResolve({ filter: /bookImageGenService$|^@\/components\/myui\/AlertToast$|^@\/core\/store$/ }, a => ({ path: a.path, namespace: 'mock' }));
      b.onLoad({ filter: /.*/, namespace: 'mock' }, () => ({ contents: `export const AlertToast=()=>{}; export const fetchImageFilters=async()=>({}); export const triggerImageGeneration=async()=>({}); export const pollImageGenerationStatus=async()=>({}); export const useReaderPreferencesStore=()=>({theme:'pure-white',fontSize:18});` }));
    } }],
  });
  const engine = process.env.KTAB_TEST_BROWSER === 'webkit' ? webkit : chromium;
  const browser = await engine.launch({ headless: true, ...(engine === chromium ? { executablePath: process.env.KTAB_CHROME_EXECUTABLE || '/usr/bin/google-chrome' } : {}) });
  try {
    for (const device of [{ name: 'iPhone', width: 390, height: 844, touch: true }, { name: 'Android', width: 412, height: 915, touch: true }, { name: 'desktop', width: 1440, height: 900, touch: false }]) {
      const userAgent = device.name === 'Android'
        ? 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36'
        : device.name === 'iPhone'
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'
          : undefined;
      const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, hasTouch: device.touch, isMobile: device.touch, userAgent });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="root"></div><p id="external">Text outside the reader</p>');
      for (const file of ['views/BookDisplayView.css', 'components/ReaderGlassHeader/ReaderGlassHeader.css']) await page.addStyleTag({ content: fs.readFileSync(path.join(reader, file), 'utf8') });
      await page.addScriptTag({ content: bundle.outputFiles[0].text });
      await page.waitForFunction(() => window.readerUI);
      await page.evaluate(() => readerUI.handleOpenImageGen());
      await page.waitForFunction(() => imageGen && readerUI.isImageGenActive);
      assert.equal(await page.evaluate(() => document.body.style.touchAction), 'auto');
      const selectionStyle = await page.locator('#excerpt').evaluate(el => { const s=getComputedStyle(el); return {select:s.userSelect || s.webkitUserSelect,touch:s.touchAction}; });
      assert.equal(selectionStyle.select, 'text'); assert.equal(selectionStyle.touch, 'auto');
      const menuAllowed = await page.locator('#excerpt').evaluate(el => el.dispatchEvent(new MouseEvent('contextmenu', { bubbles:true, cancelable:true })));
      assert.equal(menuAllowed, device.name === 'iPhone');
      // Browser selectionchange alone must capture and expand a range, without touchend.
      for (const end of [12, 28]) {
        const expected = await page.evaluate(end => { const text=document.getElementById('excerpt').firstChild; const range=document.createRange(); range.setStart(text,0); range.setEnd(text,end); const selection=getSelection(); selection.removeAllRanges(); selection.addRange(range); return text.textContent.slice(0,end).trim(); }, end);
        await page.waitForFunction(text => imageGen.contextText === text, expected);
      }
      const blocked = await page.evaluate(() => {
        const results = {};
        for (const type of ['copy', 'cut']) {
          const data = new DataTransfer(); data.setData('text/plain', getSelection().toString());
          const event = new ClipboardEvent(type, {bubbles:true,cancelable:true,clipboardData:data});
          document.body.dispatchEvent(event);
          results[type] = event.defaultPrevented && data.getData('text/plain') === '';
        }
        for (const modifier of ['ctrlKey', 'metaKey']) {
          const event = new KeyboardEvent('keydown', {key:'c',[modifier]:true,bubbles:true,cancelable:true});
          document.body.dispatchEvent(event); results[modifier] = event.defaultPrevented;
        }
        const drag = new DragEvent('dragstart', {bubbles:true,cancelable:true,dataTransfer:new DataTransfer()});
        document.getElementById('excerpt').dispatchEvent(drag); results.drag = drag.defaultPrevented;
        return results;
      });
      assert.deepEqual(blocked, {copy:true,cut:true,ctrlKey:true,metaKey:true,drag:true});
      await page.locator('#outside').evaluate(el => { const range=document.createRange();range.selectNodeContents(el);getSelection().removeAllRanges();getSelection().addRange(range); });
      await page.waitForTimeout(60);
      assert.notEqual(await page.evaluate(() => imageGen.contextText), 'Toolbar outside the excerpt');
      assert.equal(await page.locator('#external').evaluate(el => {
        const range = document.createRange(); range.selectNodeContents(el);
        getSelection().removeAllRanges(); getSelection().addRange(range);
        return el.dispatchEvent(new ClipboardEvent('copy', {bubbles:true,cancelable:true,clipboardData:new DataTransfer()}));
      }), true);
      const size = await page.locator('.ktab-mobile-slider-handle').boundingBox();
      if (device.touch) { assert.ok(size.width >= 44 && size.height >= 44); assert.ok(size.x >= -1); }
      else assert.equal(await page.locator('.ktab-mobile-slider-handle').evaluate(el => getComputedStyle(el).width), '22px');
      await page.locator('.ktab-3page-preview-sheet__body').evaluate(el => el.scrollTop=100);
      assert.ok(await page.locator('.ktab-3page-preview-sheet__body').evaluate(el => el.scrollTop > 0));
      await page.evaluate(() => readerUI.handleCloseModal());
      await page.waitForFunction(() => document.body.style.touchAction === 'none');
      assert.deepEqual(errors, []);
      console.log(`PASS ${device.name}: selection, menu policy, clipboard/shortcut/drag blocking, scrolling, and button size`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
