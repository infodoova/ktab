// Run from any directory: node tests/reader-native-tts.browser.cjs
// Install the browser first with: npx playwright install chromium (or webkit).
// KTAB_TEST_BROWSER=webkit selects WebKit; KTAB_CHROME_EXECUTABLE can select a
// system Chrome. Real MP3 playback is checked with AudioContext disabled and a
// mocked server, so these tests never request paid TTS synthesis.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname, "..");
const {build}=require(path.join(root,'node_modules/esbuild'));
const {chromium,webkit}=require(path.join(root,'node_modules/playwright'));
(async()=>{
 const bundle=await build({stdin:{contents:`
 import React from 'react';
 import {createRoot} from 'react-dom/client';
 import {useReaderTTS} from './src/features/reader/book-reader/hooks/useReaderTTS';
 import {useReaderAmbientSound} from './src/features/reader/book-reader/hooks/useReaderAmbientSound';
 window.ended=0;window.prefetch=0;window.failures=[];window.sockets=[];
 const ended=()=>window.ended++;
 const prefetch=()=>window.prefetch++;
 const failed=e=>window.failures.push(e);
 class Socket {
  static OPEN=1;static CLOSING=2;readyState=0;sent=[];
  constructor(){window.sockets.push(this);window.socket=this;setTimeout(()=>{if(this.readyState!==0)return;this.readyState=1;this.onopen?.()},0)}
  send(data){this.sent.push(JSON.parse(data))}
  close(){this.readyState=3;this.onclose?.()}
 }
 window.WebSocket=Socket;
 window.audioContexts=0;
 window.AudioContext=window.webkitAudioContext=class{constructor(){window.audioContexts++;throw Error('Web Audio deliberately unavailable')}};
 function Harness(){
  const tts=useReaderTTS({enabled:true,onPageEnded:ended,onPrefetchNextPage:prefetch,onError:failed});
  const ambient=useReaderAmbientSound();
  window.tts=tts;window.ambient=ambient;
  return <button id="play" onClick={()=>window.startResult=tts.togglePlay()}>Play</button>;
 }
 createRoot(document.getElementById('root')).render(<React.StrictMode><Harness/></React.StrictMode>);
 `,resolveDir:root,loader:'jsx'},bundle:true,write:false,format:'iife',loader:{'.mp3':'dataurl'},define:{'import.meta.env':'{}'},plugins:[{name:'store',setup(b){b.onResolve({filter:/^@\/core\/store$/},()=>({path:path.join(root,'src/core/store/readerPreferencesStore.js')}))}}]});
 const useWebKit = process.env.KTAB_TEST_BROWSER === "webkit";
 const engine = useWebKit ? webkit : chromium;
 const options = { headless: true };
 if (!useWebKit && process.env.KTAB_CHROME_EXECUTABLE) options.executablePath = process.env.KTAB_CHROME_EXECUTABLE;
 const browser = await engine.launch(options);
 try{
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 Version/26.0 Mobile/15E148 Safari/604.1'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<div id="root"></div><span data-word-index="42">word</span>');
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.waitForFunction(()=>window.tts);
 const assert=(value,message)=>{if(!value)throw Error(message);console.log('PASS',message)};
 assert(await page.evaluate(()=>audioContexts===0),'iOS TTS and ambient never instantiate the broken AudioContext');
 // Model iPhone Safari keeping the first silent play() promise pending. The
 // element still starts, but narration must not wait for that promise.
 await page.evaluate(()=>{
  const originalPlay=HTMLMediaElement.prototype.play;
  let first=true;
  HTMLMediaElement.prototype.play=function(...args){
   const actual=originalPlay.apply(this,args);
   if(first){first=false;actual?.catch(()=>{});return new Promise(()=>{});}
   return actual;
  };
 });
 await page.click('#play');
 await page.waitForFunction(()=>tts.isPlaying&&tts.isLoading);
 assert(await page.evaluate(()=>Promise.race([startResult,new Promise(resolve=>setTimeout(()=>resolve(false),1000))])),'A pending silent play does not block the TTS request');
 const payload={bookId:1,voiceId:'voice',page:1,startWord:42,endWord:44,wordsPerPage:2,isLastPage:false,text:'word text'};
 await page.evaluate(p=>tts.startPageStream(p),payload);
 await page.evaluate(base64=>window.mp3=Uint8Array.from(atob(base64),x=>x.charCodeAt(0)),fs.readFileSync(path.join(root,'src/assets/audio/rain.mp3')).toString('base64'));
 const complete=async(align=true,blob=false)=>page.evaluate(async({align,blob})=>{
  if(align)socket.onmessage({data:JSON.stringify({type:'alignment',seq:1,words:[{startSeconds:0,endSeconds:10,startChar:0,endChar:4,word:'word'}]})});
  const chunk=new Uint8Array(8+mp3.length);chunk.set(mp3,8);
  socket.onmessage({data:blob?new Blob([chunk]):chunk.buffer});
  if(align)socket.onmessage({data:chunk.buffer.slice(0)});
  socket.onmessage({data:JSON.stringify({type:'complete'})});
 },{align,blob});
 await complete();
 await page.waitForFunction(()=>!tts.isLoading&&tts.isPlaying&&document.querySelector('audio').currentTime>0.1);
 assert(await page.evaluate(()=>document.querySelector('audio').currentSrc.startsWith('blob:')&&document.querySelectorAll('audio').length===1),'Real MP3 plays through the same native element used by the gesture');
 await page.waitForFunction(()=>document.querySelector('[data-word-index="42"]').classList.contains('tts-active-word'));
 assert(true,'Word highlighting follows native media time');
 const next={...payload,page:2,startWord:44,endWord:46,isLastPage:true,text:''};
 await page.evaluate(p=>tts.startPageStream(p,0,{prefetch:true}),next);
 await complete(false,true);
 await page.waitForFunction(()=>tts.hasPrefetch());
 const sentBefore=await page.evaluate(()=>socket.sent.length);
 const firstSrc=await page.evaluate(()=>document.querySelector('audio').currentSrc);
 await page.evaluate(()=>{const a=document.querySelector('audio');a.currentTime=a.duration-.03});
 await page.waitForFunction(src=>document.querySelector('audio').currentSrc!==src&&document.querySelector('audio').currentTime>0.1,firstSrc);
 assert(await page.evaluate(()=>ended===0&&document.querySelectorAll('audio').length===1),'Multiple complete MP3 chunks play sequentially before the page ends');
 await page.evaluate(()=>{const a=document.querySelector('audio');a.currentTime=a.duration-.03});
 await page.waitForFunction(()=>ended===1);
 await page.evaluate(p=>tts.startPageStream({...p,text:'cached page content'}),next);
 await page.waitForFunction(()=>!tts.isLoading&&tts.isPlaying&&document.querySelector('audio').currentTime>0.1);
 assert(await page.evaluate(n=>socket.sent.length===n&&document.querySelectorAll('audio').length===1,sentBefore),'Prefetched page promotes without another request or another audio element');
 await page.evaluate(()=>{const a=document.querySelector('audio');a.currentTime=a.duration-.03});
 await page.waitForFunction(()=>!tts.isPlaying&&!tts.isLoading);
 assert(await page.evaluate(()=>ended===1),'Final page stops without turning again');
 await page.click('#play');
 await page.evaluate(()=>startResult);
 await page.evaluate(()=>socket.onmessage({data:JSON.stringify({type:'error',message:'simulated failure'})}));
 await page.waitForFunction(()=>!tts.isPlaying&&!tts.isLoading&&failures.length===1);
 assert(await page.evaluate(()=>failures[0].code==='TTS-SERVER'),'Server failure resets playback and identifies the failed stage');
 await page.click('#play');
 await page.evaluate(()=>startResult);
 await page.evaluate(p=>tts.startPageStream(p),payload);
 await page.evaluate(()=>socket.onmessage({data:JSON.stringify({type:'complete'})}));
 await page.waitForFunction(()=>!tts.isPlaying&&!tts.isLoading&&failures.length===2);
 assert(await page.evaluate(()=>failures[1].code==='TTS-NO-AUDIO'),'A server completion without audio reports the missing audio');
 await page.click('#play');
 await page.evaluate(()=>startResult);
 await page.evaluate(p=>tts.startPageStream(p),payload);
 await complete();
 await page.waitForFunction(()=>!tts.isLoading&&tts.isPlaying);
 await page.click('#play');
 await page.waitForFunction(()=>!tts.isPlaying&&!tts.isLoading);
 assert(await page.evaluate(()=>document.querySelector('audio').paused&&socket.readyState===3),'Pause cancels native audio and its socket');
 await page.evaluate(()=>tts.stopReader());
 assert(await page.evaluate(()=>document.querySelectorAll('audio').length===0&&audioContexts===0),'Reader exit releases native media without Web Audio');
 assert(errors.length===0,'No browser runtime errors');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
