const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync('app.js','utf8'),music=fs.readFileSync('music-timeline.js','utf8');
assert(app.includes("graph.hum.type=a.humFrequency?'notch':'allpass'"));assert(!app.includes('a.humFrequency?12:.0001'));
const functions=music.slice(music.indexOf('function musicFadeGains'),music.indexOf('function showAudioError'));
const ctx={clips:{flower:{duration:18.5185}},musicFadeDuration:3,musicTransitionType:null};vm.createContext(ctx);vm.runInContext(functions,ctx);
for(const type of ['constantGain','constantPower','exponential']){
 for(let p=0;p<=1;p+=.01){const [a,b]=ctx.musicFadeGains(type,p);assert(a>=0&&a<=1);assert(b>=0&&b<=1);if(type==='constantPower')assert(Math.abs(a*a+b*b-1)<1e-10);if(type==='constantGain')assert(Math.abs(a+b-1)<1e-10)}
 assert(ctx.musicFadeGains(type,0)[0]===1);assert(ctx.musicFadeGains(type,1)[1]===1);
 ctx.musicTransitionType=type;
 const before=ctx.musicFrame(16).gains,mid=ctx.musicFrame(18.5185).gains,after=ctx.musicFrame(21).gains;
 assert(before[0]===1&&before[1]===0);assert(mid.every(v=>v>0));assert(after[0]<1e-10&&after[1]===1);
}
ctx.musicTransitionType=null;assert(ctx.musicFrame(18).gains[0]===1);assert(ctx.musicFrame(19).gains[1]===1);
assert(app.includes('applyExtendedAudioSettings(secondAudioGraph,secondSettings)'));
assert(app.includes('audioClipStates[selectedAudio]'));
console.log('PASS: DeHummer disabled allpass; 3 gain curves, endpoints, overlap, cut, independent effects');
