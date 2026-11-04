const video=document.querySelector('#programVideo');
const clips={flower:{src:'assets/videos/9054643-hd_1920_1080_30fps.mp4',label:'꽃_30fps.mp4',fps:30},car:{src:'assets/videos/5057527-hd_1920_1080_25fps.mp4',label:'자동차_25fps.mp4',fps:25}};
const defaults={positionX:0,positionY:0,scale:100,rotation:0,opacity:100,brightness:100,contrast:100,saturation:100,hue:0,blur:0};
const values={...defaults}; const enabled={motion:true,opacity:true,color:true,blur:true}; let active='flower';
const ids=Object.keys(defaults); const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
function units(id,v){return ['scale','opacity','brightness','contrast','saturation'].includes(id)?v+'%':['rotation','hue'].includes(id)?v+'°':id==='blur'?v+'px':String(v)}
function apply(){
 const tx=enabled.motion?values.positionX:0,ty=enabled.motion?values.positionY:0,sc=enabled.motion?values.scale:100,rot=enabled.motion?values.rotation:0;
 video.style.transform=`translate(${tx}px,${ty}px) scale(${sc/100}) rotate(${rot}deg)`;
 video.style.opacity=(enabled.opacity?values.opacity:100)/100;
 const b=enabled.color?values.brightness:100,c=enabled.color?values.contrast:100,s=enabled.color?values.saturation:100,h=enabled.color?values.hue:0,bl=enabled.blur?values.blur:0;
 video.style.filter=`brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) blur(${bl}px)`;
 $('#status').textContent=`FX · B ${b}% · C ${c}% · S ${s}% · Blur ${bl}px`;
}
ids.forEach(id=>{$('#'+id).addEventListener('input',e=>{values[id]=Number(e.target.value);e.target.nextElementSibling.value=units(id,values[id]);apply()})});
function selectClip(key){active=key;const wasPlaying=!video.paused;video.src=clips[key].src;video.load();if(wasPlaying)video.play().catch(()=>{});$('#clipLabel').textContent=clips[key].label;$('#controlClip').textContent=clips[key].label;$$('[data-clip]').forEach(x=>x.classList.toggle('selected',x.dataset.clip===key));}
$$('[data-clip]').forEach(x=>x.addEventListener('click',()=>selectClip(x.dataset.clip)));
$('#playButton').addEventListener('click',()=>video.paused?video.play():video.pause()); video.addEventListener('play',()=>$('#playButton').textContent='❚❚');video.addEventListener('pause',()=>$('#playButton').textContent='▶');
$('#prevFrame').addEventListener('click',()=>video.currentTime=Math.max(0,video.currentTime-1/clips[active].fps));$('#nextFrame').addEventListener('click',()=>video.currentTime=Math.min(video.duration||0,video.currentTime+1/clips[active].fps));
function tc(t,fps){if(!Number.isFinite(t))t=0;const frames=Math.floor((t%1)*fps),s=Math.floor(t)%60,m=Math.floor(t/60)%60,h=Math.floor(t/3600);return [h,m,s,frames].map(v=>String(v).padStart(2,'0')).join(':')}
video.addEventListener('loadedmetadata',()=>{$('#duration').textContent=tc(video.duration,clips[active].fps);$('#status').textContent='Video ready';apply()});video.addEventListener('error',()=>$('#status').textContent='Video load error');
video.addEventListener('timeupdate',()=>{$('#currentTime').textContent=tc(video.currentTime,clips[active].fps);$('#playhead').style.left=`calc(42px + ${(video.currentTime/(video.duration||1))*50}%)`});
$$('.fx-toggle').forEach(x=>x.addEventListener('click',()=>{enabled[x.dataset.group]=!enabled[x.dataset.group];x.classList.toggle('active',enabled[x.dataset.group]);apply()}));
const presets={blur:{blur:12},vivid:{brightness:108,contrast:125,saturation:165},mono:{saturation:0,contrast:115},tilt:{rotation:-6,scale:112}};
$$('[data-preset]').forEach(x=>x.addEventListener('click',()=>{Object.assign(values,presets[x.dataset.preset]);sync();apply();x.animate([{background:'#655ac5'},{background:'transparent'}],{duration:500})}));
function sync(){ids.forEach(id=>{$('#'+id).value=values[id];$('#'+id).nextElementSibling.value=units(id,values[id])})}
$('#resetButton').addEventListener('click',()=>{Object.assign(values,defaults);Object.keys(enabled).forEach(k=>enabled[k]=true);$$('.fx-toggle').forEach(x=>x.classList.add('active'));sync();apply()});
$('#effectSearch').addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('#effectList button').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(q))});apply();

// Automated browser smoke test. It only runs when the explicit query string is present.
if(new URLSearchParams(location.search).has('selftest')){
 const report=document.createElement('pre');report.id='selfTestResult';report.hidden=true;document.body.append(report);
 const wait=(event,timeout=8000)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(event+' timeout')),timeout);video.addEventListener(event,()=>{clearTimeout(timer);resolve()},{once:true})});
 (async()=>{const results=[];
  if(video.readyState<1)await wait('loadedmetadata');results.push({name:'flower metadata',pass:video.videoWidth===1920&&video.videoHeight===1080,detail:`${video.videoWidth}x${video.videoHeight}`});
  await video.play();await new Promise(r=>setTimeout(r,500));results.push({name:'flower playback',pass:!video.paused&&video.currentTime>0,detail:`time=${video.currentTime.toFixed(3)}`});video.pause();
  const blur=$('#blur');blur.value='12';blur.dispatchEvent(new Event('input',{bubbles:true}));results.push({name:'blur slider',pass:getComputedStyle(video).filter.includes('blur(12px)'),detail:getComputedStyle(video).filter});
  const sat=$('#saturation');sat.value='165';sat.dispatchEvent(new Event('input',{bubbles:true}));results.push({name:'color slider',pass:getComputedStyle(video).filter.includes('saturate(1.65)'),detail:getComputedStyle(video).filter});
  selectClip('car');if(video.readyState<1)await wait('loadedmetadata');results.push({name:'car metadata',pass:video.videoWidth===1920&&video.videoHeight===1080,detail:`${video.videoWidth}x${video.videoHeight}`});
  await video.play();await new Promise(r=>setTimeout(r,500));results.push({name:'car playback',pass:!video.paused&&video.currentTime>0,detail:`time=${video.currentTime.toFixed(3)}`});video.pause();
  report.textContent=JSON.stringify({passed:results.every(x=>x.pass),results});report.dataset.done='true';document.title=results.every(x=>x.pass)?'SELFTEST_PASS':'SELFTEST_FAIL';
 })().catch(error=>{report.textContent=JSON.stringify({passed:false,error:String(error)});report.dataset.done='true';document.title='SELFTEST_FAIL'});
}
