// Executes the genuine classic particles.js 2.0.0 source and real TypeScript adapters.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const targets=[], elements=[];
class Target {
  listeners=new Map();
  constructor(){targets.push(this);}
  addEventListener(type,callback,options={}){if(options?.signal?.aborted)return;const set=this.listeners.get(type)??new Set();set.add(callback);this.listeners.set(type,set);options?.signal?.addEventListener('abort',()=>set.delete(callback),{once:true});}
  removeEventListener(type,callback){this.listeners.get(type)?.delete(callback);}
  emit(type,data={}){for(const callback of [...(this.listeners.get(type)??[])])callback({type,target:this,...data});}
  listenerCount(){return [...this.listeners.values()].reduce((sum,set)=>sum+set.size,0);}
}
class ElementMock extends Target {
  clientWidth=1000;clientHeight=650;attributes=new Set();children=[];style={};dataset={};id='';className='';parentElement=null;tagName='DIV';
  constructor(tag='div'){super();this.tagName=tag.toUpperCase();elements.push(this);}
  get offsetWidth(){return this.parentElement?.clientWidth??this.clientWidth;}
  get offsetHeight(){return this.parentElement?.clientHeight??this.clientHeight;}
  appendChild(child){child.parentElement=this;this.children.push(child);return child;}
  removeChild(child){this.children=this.children.filter(c=>c!==child);child.parentElement=null;return child;}
  remove(){this.parentElement?.removeChild(this);}
  querySelector(selector){return this.querySelectorAll(selector)[0]??null;}
  querySelectorAll(selector){const all=this.children.flatMap(c=>[c,...c.querySelectorAll('*')]);if(selector==='*')return all;if(selector.includes('canvas'))return all.filter(c=>c.tagName==='CANVAS');if(selector==='.particles-js-canvas-el')return all.filter(c=>c.className==='particles-js-canvas-el');return [];}
  getElementsByClassName(name){return new Proxy({},{get:(_,key)=>{const a=this.children.filter(c=>c.className===name);return key==='length'?a.length:a[Number(key)];}});}
  closest(){return null;}
  setAttribute(name,value){this.attributes.add(name);if(name==='id')this.id=value;}
  getAttribute(name){return name==='id'?this.id:this.attributes.has(name)?'':null;}
  toggleAttribute(name,value){if(value)this.attributes.add(name);else this.attributes.delete(name);}
  removeAttribute(name){this.attributes.delete(name);}
  getBoundingClientRect(){return {left:0,top:0,right:this.clientWidth,bottom:this.clientHeight,width:this.clientWidth,height:this.clientHeight};}
}
function ctx(){return {clears:0,paths:[],clips:0,setTransform(){},clearRect(){this.clears++;this.paths=[];},beginPath(){},closePath(){},save(){},restore(){},rect(){},clip(){this.clips++;},fillRect(){},translate(){},rotate(){},moveTo(...a){this.paths.push(['move',...a]);},lineTo(...a){this.paths.push(['line',...a]);},arc(...a){this.paths.push(['arc',...a]);},stroke(){},fill(){}};}
function createElement(tag){const e=new ElementMock(tag);if(tag==='canvas'){e.ctx=ctx();e.getContext=()=>e.ctx;e.width=0;e.height=0;}return e;}
function container(preset){const host=createElement('section'),layer=createElement('div');layer.dataset.particlePreset=preset;layer.id='test-field-'+elements.length;host.appendChild(layer);return layer;}
class ObserverMock {
  static instances=[];observed=new Set();disconnected=false;
  constructor(callback){this.callback=callback;this.constructor.instances.push(this);}
  observe(target){this.observed.add(target);}unobserve(target){this.observed.delete(target);}disconnect(){this.disconnected=true;this.observed.clear();}
}
class IO extends ObserverMock {static instances=[];}
class RO extends ObserverMock {static instances=[];}
const doc=new Target(),win=new Target();doc.hidden=false;
let layers=[];doc.querySelectorAll=s=>s.includes('data-particle-preset')?layers:[];
doc.getElementById=id=>elements.find(e=>e.id===id)??null;doc.createElement=createElement;
doc.querySelector=s=>{if(!s.startsWith('#'))return null;const [id]=s.slice(1).split(/\s/);return doc.getElementById(id)?.querySelector('canvas')??null;};
const media=new Map();function matchMedia(query){if(!media.has(query))media.set(query,Object.assign(new Target(),{matches:false}));return media.get(query);}
function preference(query,value){const m=matchMedia(query);m.matches=value;m.emit('change',{matches:value});}
let now=100,id=0;const frames=new Map(),timers=new Map();
function frame(time){now=time;const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(time);}
Object.assign(win,{window:win,document:doc,console,AbortController,Element:ElementMock,HTMLElement:ElementMock,HTMLDivElement:ElementMock,IntersectionObserver:IO,ResizeObserver:RO,matchMedia,navigator:{hardwareConcurrency:8,deviceMemory:8},devicePixelRatio:3,performance:{now:()=>now},requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:key=>frames.delete(key),setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:key=>timers.delete(key)});
const sandbox=vm.createContext(win),libraryPath=path.join(root,'node_modules/particles.js/particles.js');
assert.equal(fs.readFileSync(path.join(root,'public/vendor/particles.js'),'utf8'),fs.readFileSync(libraryPath,'utf8'),'Hosted vendor file must equal pinned installed source');
// Do not transpile or wrap the vendor source: Object.deepExtend requires classic arguments.callee.
vm.runInContext(fs.readFileSync(libraryPath,'utf8'),sandbox,{filename:libraryPath});
const cache=new Map();function load(name){const absolute=path.resolve(root,'src/lib/particles',name+'.ts');if(cache.has(absolute))return cache.get(absolute).exports;const source=fs.readFileSync(absolute,'utf8').replace(/^if \(import\.meta\.hot\).*$/m,'').replaceAll('import.meta.env.BASE_URL',JSON.stringify('/'));const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}});const mod={exports:{}};cache.set(absolute,mod);const fn=vm.runInContext(`(function(require,module,exports){${outputText}\n})`,sandbox,{filename:absolute});fn(specifier=>load(specifier.replace(/^\.\//,'')),mod,mod.exports);return mod.exports;}
const {ParticleEngine}=load('ParticleEngine'),{initParticles,destroyParticles}=load('ParticleManager');
const listenerCount=()=>targets.reduce((sum,t)=>sum+t.listenerCount(),0);
const observers=()=>[...IO.instances,...RO.instances].filter(o=>!o.disconnected);
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
let assertions=1;function check(value,description){assert.ok(value,description);assertions++;}
for(const preset of ['radial','constellation','magnetic-grid','displacement','timeline','attraction']){
  const layer=container(preset),before=listenerCount(),engine=new ParticleEngine(layer,preset),entry=win.pJSDom.at(-1),p=entry.pJS,c=layer.querySelector('canvas');
  check(c&&p.canvas.el===c,`${preset}: genuine library-created canvas`);
  check(p.particles.array.length>0&&typeof p.particles.array[0].draw==='function',`${preset}: genuine library particles`);
  check(frames.size===0,`${preset}: no vendor animation loop`);
  engine.visible=true;const clears=c.ctx.clears;engine.frame(100,16.667);
  check(c.ctx.clears>clears&&c.ctx.paths.length>0,`${preset}: real library renders geometry`);
  check(c.width>0&&c.height>0&&c.width<=1500&&c.height<=975,`${preset}: DPR backing store bounded`);
  engine.setStatic(true);engine.frame(200,16.667);
  const positions=JSON.stringify(p.particles.array.map(q=>[q.x,q.y]));
  layer.parentElement.emit('pointermove',{pointerType:'mouse',clientX:100,clientY:100});engine.frame(900,32);
  check(JSON.stringify(p.particles.array.map(q=>[q.x,q.y]))===positions,`${preset}: static positions ignore mouse and time`);
  layer.clientWidth=600;layer.clientHeight=400;layer.parentElement.clientWidth=600;layer.parentElement.clientHeight=400;
  const ro=RO.instances.at(-1);ro.callback([{target:layer.parentElement}]);
  check(c.width===600&&c.height===400,`${preset}: ResizeObserver resizes DPR-1 backing store`);
  engine.destroy();const draws=c.ctx.clears;engine.frame(1000,32);ro.callback([{target:layer.parentElement}]);
  check(c.ctx.clears===draws&&!layer.querySelector('canvas'),`${preset}: destroyed engine cannot draw`);
  check(!win.pJSDom.includes(entry),`${preset}: exact registry entry removed`);
  check(observers().length===0&&listenerCount()===before,`${preset}: observers and listeners released`);engine.destroy();
}
// Regression: radial samples outside the canvas must not collapse into edge rows.
for(const [width,height] of [[390,844],[1600,900],[2560,1080]]){
  const layer=container('radial');layer.clientWidth=width;layer.clientHeight=height;
  const engine=new ParticleEngine(layer,'radial'),p=win.pJSDom.at(-1).pJS;
  engine.setStatic(true);
  check(p.particles.array.every(q=>q.x>3&&q.x<width-3&&q.y>3&&q.y<height-3),`Radial ${width}px: no particles pinned to canvas edges`);
  check(new Set(p.particles.array.map(q=>q.x)).size===p.particles.array.length,`Radial ${width}px: no duplicated vertical edge column`);
  engine.resize();
  check(p.particles.array.every(q=>q.x>3&&q.x<width-3&&q.y>3&&q.y<height-3),`Radial ${width}px: resize does not recreate edge pile-up`);
  engine.destroy();
}
{
  const a=container('radial'),b=container('constellation'),first=new ParticleEngine(a,'radial'),second=new ParticleEngine(b,'constellation'),survivor=win.pJSDom.at(-1);first.destroy();
  check(win.pJSDom.length===1&&win.pJSDom[0]===survivor,'Destroy preserves sibling pJSDom entry');
  second.visible=true;second.frame(100,16.667);check(b.querySelector('canvas').ctx.paths.length>0,'Sibling library instance still draws');second.destroy();
}
{
  const layer=container('radial'),exclusion=createElement('p');
  exclusion.clientWidth=200;exclusion.clientHeight=100;
  const originalQuery=layer.parentElement.querySelectorAll.bind(layer.parentElement);
  layer.parentElement.querySelectorAll=selector=>selector==='[data-particle-exclude]'?[exclusion]:originalQuery(selector);
  const engine=new ParticleEngine(layer,'radial'),p=win.pJSDom.at(-1).pJS,c=layer.querySelector('canvas');
  engine.visible=true;engine.frame(100,16.667);
  check(c.ctx.clips>0,'Text exclusions clip the genuine renderer');
  check(p.interactivity.events.onclick.enable===false&&p.interactivity.events.resize===false,'Vendor click and resize listeners remain disabled');
  check(p.particles.move.enable===false,'Shared scheduler restores vendor move enable after drawing');
  const original=JSON.stringify(p.particles.array.map(q=>[q.x,q.y]));
  layer.parentElement.emit('pointermove',{pointerType:'mouse',clientX:950,clientY:325});
  for(let i=1;i<=20;i++)engine.frame(100+i*16.667,16.667);
  check(JSON.stringify(p.particles.array.map(q=>[q.x,q.y]))!==original,'Pointer changes genuine library particle positions');
  check(frames.size===0&&timers.size===0,'Interactive rendering does not schedule vendor RAF or timers');
  engine.destroy();
}
layers=[container('radial'),container('constellation')];initParticles();initParticles();await flush();
check(observers().length===3,'Async repeated init creates one IO and two ROs');check(win.pJSDom.length===2,'Manager mounts two real library instances');check(frames.size===0,'Offscreen fields never schedule frames');
let io=IO.instances.at(-1);const visible=value=>io.callback(layers.map(c=>({target:c.parentElement,isIntersecting:value})));
visible(true);visible(true);check(frames.size===1,'All visible fields share one rAF');
frame(100);const draws=layers.map(c=>c.querySelector('canvas').ctx.clears);frame(108);check(layers.every((c,i)=>c.querySelector('canvas').ctx.clears===draws[i]),'120Hz callbacks skip excess painting');frame(117);
visible(false);check(frames.size===0,'Viewport leave pauses loop');visible(true);doc.hidden=true;doc.emit('visibilitychange');check(frames.size===0,'Hidden document pauses loop');doc.hidden=false;doc.emit('visibilitychange');check(frames.size===1,'Visible document resumes single loop');
preference('(prefers-reduced-motion: reduce)',true);check(frames.size===0,'Reduced motion stops loop');preference('(prefers-reduced-motion: reduce)',false);check(frames.size===1,'Disabling reduced motion resumes loop');preference('(pointer: coarse)',true);check(frames.size===0,'Coarse pointer switches to static');preference('(pointer: coarse)',false);check(frames.size===1,'Fine pointer resumes loop');
win.emit('pagehide');check(frames.size===0&&observers().length===0&&win.pJSDom.length===0,'pagehide releases vendor entries observers and RAF');
win.emit('pageshow');win.emit('pageshow');doc.emit('astro:page-load');await flush();check(observers().length===3&&win.pJSDom.length===2,'BFCache and Astro remount are idempotent');
io=IO.instances.at(-1);visible(true);doc.emit('astro:before-swap');check(frames.size===0&&observers().length===0&&win.pJSDom.length===0,'Before-swap destroys all actual library instances');doc.emit('astro:page-load');await flush();check(observers().length===3,'Page-load remounts after swap');
destroyParticles();destroyParticles();check(frames.size===0&&timers.size===0&&observers().length===0&&listenerCount()===0&&win.pJSDom.length===0,'Final disposal releases listeners observers RAF timers and pJSDom');
initParticles();destroyParticles();await flush();
check(observers().length===0&&win.pJSDom.length===0&&frames.size===0,'Async pending mount cannot resurrect a disposed manager');
console.log(`Particle tests passed: ${assertions} assertions with real particles.js 2.0.0. DOM/Canvas are mocks; visual quality, browser heap retention, FPS and GPU behavior require browser validation.`);

