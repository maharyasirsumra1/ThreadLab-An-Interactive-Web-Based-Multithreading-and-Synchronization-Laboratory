/* Deterministic, dependency-free educational state transitions. */
export function boundedBufferTransition(queue,capacity,action,newItem){
  if(!Array.isArray(queue)||!Number.isInteger(capacity)||capacity<1)throw new TypeError('Invalid buffer settings');
  if(action==='produce'){
    if(queue.length>=capacity)return {status:'full',queue:queue.slice(),item:null};
    if(!newItem||!Number.isInteger(newItem.id))throw new TypeError('An item id is required');
    return {status:'produced',queue:[...queue,newItem],item:newItem};
  }
  if(action==='consume'){
    if(!queue.length)return {status:'empty',queue:[],item:null};
    return {status:'consumed',queue:queue.slice(1),item:queue[0]};
  }
  throw new TypeError('Invalid buffer action');
}
export function sharedCounterWrite(snapshot){return snapshot+1}
export function protectedIncrement(current){return current+1}
export function describeCounterResult(expected,actual){return {expected,actual,lost:Math.max(0,expected-actual),correct:expected===actual}}
