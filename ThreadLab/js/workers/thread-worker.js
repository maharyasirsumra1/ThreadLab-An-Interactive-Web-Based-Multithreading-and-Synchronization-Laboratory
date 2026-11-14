/* Real browser Web Worker: task runs independently of the page's main UI thread. */
let timer=null,elapsed=0,config=null,paused=false,finished=false;
function stop(){if(timer!==null){clearInterval(timer);timer=null}}
self.addEventListener('message',event=>{const message=event.data||{};if(message.type==='start'){
 stop();elapsed=0;paused=false;finished=false;const duration=Math.max(100,Math.min(10000,Number(message.duration)||1200));config={id:Number(message.id),duration,payload:String(message.payload||'')};self.postMessage({type:'started',id:config.id,payload:config.payload});
 timer=setInterval(()=>{if(paused||finished)return;elapsed=Math.min(duration,elapsed+75);const progress=Math.round(elapsed/duration*100);self.postMessage({type:'progress',id:config.id,progress,elapsed});if(elapsed>=duration){finished=true;stop();self.postMessage({type:'complete',id:config.id,payload:config.payload,elapsed});self.close()}},75);
 }else if(message.type==='pause'){paused=true}else if(message.type==='resume'){paused=false}else if(message.type==='cancel'){stop();self.close()}});
