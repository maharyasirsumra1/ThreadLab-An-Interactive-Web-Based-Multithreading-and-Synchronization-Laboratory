import test from 'node:test';
import assert from 'node:assert/strict';
import {boundedBufferTransition,sharedCounterWrite,protectedIncrement,describeCounterResult} from '../js/core/simulation.js';
import {clamp,makeRunner,csvCell} from '../js/core/ui.js';

test('bounded buffer respects capacity and FIFO',()=>{
 let q=[];
 const first=boundedBufferTransition(q,2,'produce',{id:1});q=first.queue;
 const second=boundedBufferTransition(q,2,'produce',{id:2});q=second.queue;
 assert.equal(q.length,2);
 assert.equal(boundedBufferTransition(q,2,'produce',{id:3}).status,'full');
 assert.equal(boundedBufferTransition(q,2,'produce',{id:3}).queue.length,2);
 const take1=boundedBufferTransition(q,2,'consume');assert.equal(take1.item.id,1);
 const take2=boundedBufferTransition(take1.queue,2,'consume');assert.equal(take2.item.id,2);
 assert.equal(boundedBufferTransition(take2.queue,2,'consume').status,'empty');
});
test('counter: unsafe interleavings cause lost updates',()=>{
 let counter=0;const a=counter,b=counter;counter=sharedCounterWrite(a);counter=sharedCounterWrite(b);
 assert.deepEqual(describeCounterResult(2,counter),{expected:2,actual:1,lost:1,correct:false});
 counter=0;counter=protectedIncrement(counter);counter=protectedIncrement(counter);
 assert.deepEqual(describeCounterResult(2,counter),{expected:2,actual:2,lost:0,correct:true});
});
test('runner supports pause, resume, cancellation',async()=>{
 const runner=makeRunner(),token=runner.start();runner.pause();assert.equal(runner.isPaused,true);runner.resume();assert.equal(await runner.sleep(55,token),true);runner.finish(token);assert.equal(runner.active,false);
 const old=runner.start();runner.cancel();assert.equal(await runner.sleep(20,old),false)
});
test('shared utilities enforce boundaries and CSV escaping',()=>{
 assert.equal(clamp(11,0,10),10);
 assert.equal(clamp(-2,0,10),0);
 assert.equal(csvCell('foo"bar'), '"foo""bar"');
});
