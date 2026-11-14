import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('../js/workers/thread-worker.js',import.meta.url),'utf8');
function createWorker(){const messages=[];let handler;const self={addEventListener:(kind,fn)=>{if(kind==='message')handler=fn},postMessage:(m)=>messages.push(m),close:()=>{}};const context=vm.createContext({self,setInterval,clearInterval,Math,Number,String});vm.runInContext(code,context);return {messages,post:(m)=>handler({data:m})}}
test('worker sends started, progress, completion with its argument',async()=>{const worker=createWorker();worker.post({type:'start',id:2,duration:100,payload:'Data-2'});await new Promise(r=>setTimeout(r,190));assert.equal(worker.messages[0].type,'started');assert.equal(worker.messages[0].payload,'Data-2');assert.ok(worker.messages.some(x=>x.type==='progress'));assert.equal(worker.messages.at(-1).type,'complete');assert.equal(worker.messages.at(-1).id,2)});
test('worker cancellation prevents completion',async()=>{const worker=createWorker();worker.post({type:'start',id:1,duration:600,payload:'Stop-1'});worker.post({type:'cancel'});await new Promise(r=>setTimeout(r,110));assert.equal(worker.messages.filter(x=>x.type==='complete').length,0)});
