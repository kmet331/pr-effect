const video=document.querySelector('#programVideo');
const monitor=document.querySelector('#monitor');
const clips={flower:{src:'assets/videos/9054643-hd_1920_1080_30fps.mp4',label:'꽃_30fps.mp4',fps:30},car:{src:'assets/videos/5057527-hd_1920_1080_25fps.mp4',label:'자동차_25fps.mp4',fps:25}};
const defaults={positionX:0,positionY:0,scale:100,rotation:0,opacity:100,brightness:100,contrast:100,saturation:100,hue:0,blur:0};
const values={...defaults};const enabled={motion:true,opacity:true,color:true,blur:true};let active='flower';
const ids=Object.keys(defaults),$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const effectClasses=['fx-mirror','fx-flip','fx-lens','fx-basic3d','fx-wave','fx-mosaic','fx-vignette','fx-grid','fx-gradient','fx-noise','fx-scanlines','fx-glow','fx-emboss','fx-edges','fx-posterize','fx-invert','fx-strobe','fx-dissolve','fx-dipBlack','fx-wipe','fx-directional'];
const appliedEffects=new Map();
const presets={
 blur:{label:'Gaussian Blur',values:{blur:12}},directionalBlur:{label:'Directional Blur',className:'fx-directional',values:{blur:2}},sharpen:{label:'Sharpen',values:{contrast:145,saturation:120}},
 vivid:{label:'Lumetri Color · Vivid',values:{brightness:108,contrast:125,saturation:165}},mono:{label:'Black & White',values:{saturation:0,contrast:115}},brightContrast:{label:'Brightness & Contrast',values:{brightness:125,contrast:140}},warm:{label:'Color Balance · Warm',values:{hue:-12,saturation:125,brightness:106}},cool:{label:'Color Balance · Cool',values:{hue:18,saturation:118,brightness:102}},hueShift:{label:'Hue/Saturation',values:{hue:90,saturation:145}},faded:{label:'Faded Film',values:{brightness:112,contrast:78,saturation:72}},invert:{label:'Invert',className:'fx-invert'},
 tilt:{label:'Transform · Tilt',values:{rotation:-6,scale:112}},mirror:{label:'Mirror',className:'fx-mirror'},flip:{label:'Vertical Flip',className:'fx-flip'},lens:{label:'Lens Distortion',className:'fx-lens'},wave:{label:'Wave Warp',className:'fx-wave'},
 grid:{label:'Grid',className:'fx-grid'},gradient:{label:'4-Color Gradient',className:'fx-gradient'},noise:{label:'Noise',className:'fx-noise'},basic3d:{label:'Basic 3D',className:'fx-basic3d'},
 emboss:{label:'Emboss',className:'fx-emboss'},edges:{label:'Find Edges',className:'fx-edges'},mosaic:{label:'Mosaic',className:'fx-mosaic'},posterize:{label:'Posterize',className:'fx-posterize'},vignette:{label:'Vignette',className:'fx-vignette'},glow:{label:'Glow',className:'fx-glow'},scanlines:{label:'Scan Lines',className:'fx-scanlines'},strobe:{label:'Strobe Light',className:'fx-strobe'},
 dissolve:{label:'Cross Dissolve',className:'fx-dissolve',transient:true},dipBlack:{label:'Dip to Black',className:'fx-dipBlack',transient:true},wipe:{label:'Linear Wipe',className:'fx-wipe',transient:true}
};
function units(id,v){return ['scale','opacity','brightness','contrast','saturation'].includes(id)?v+'%':['rotation','hue'].includes(id)?v+'°':id==='blur'?v+'px':String(v)}
function apply(){
 const tx=enabled.motion?values.positionX:0,ty=enabled.motion?values.positionY:0,sc=enabled.motion?values.scale:100,rot=enabled.motion?values.rotation:0;
 const baseTransform=`translate(${tx}px,${ty}px) scale(${sc/100}) rotate(${rot}deg)`;
 const b=enabled.color?values.brightness:100,c=enabled.color?values.contrast:100,s=enabled.color?values.saturation:100,h=enabled.color?values.hue:0,bl=enabled.blur?values.blur:0;
 const baseFilter=`brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) blur(${bl}px)`;
 monitor.style.setProperty('--base-transform',baseTransform);monitor.style.setProperty('--base-filter',baseFilter);video.style.opacity=(enabled.opacity?values.opacity:100)/100;
 $('#status').textContent=`FX ${appliedEffects.size} · B ${b}% · C ${c}% · S ${s}% · Blur ${bl}px`;
}
function sync(){ids.forEach(id=>{$('#'+id).value=values[id];$('#'+id).nextElementSibling.value=units(id,values[id])})}
function renderApplied(){
 const box=$('#appliedEffects');box.innerHTML='';$('#effectCount').textContent=appliedEffects.size;
 if(!appliedEffects.size){box.innerHTML='<span class="empty-effects">Effects 패널에서 효과를 선택하세요.</span>'}
 else appliedEffects.forEach((effect,key)=>{const chip=document.createElement('button');chip.className='effect-chip';chip.textContent=`fx ${effect.label} ×`;chip.title='클릭하여 제거';chip.addEventListener('click',()=>removeEffect(key));box.append(chip)});
 $$('[data-preset]').forEach(button=>button.classList.toggle('applied',appliedEffects.has(button.dataset.preset)));
}
function rebuildFromEffects(){
 Object.assign(values,defaults);monitor.classList.remove(...effectClasses);
 appliedEffects.forEach(effect=>{if(effect.values)Object.assign(values,effect.values);if(effect.className)monitor.classList.add(effect.className)});
 sync();apply();
}
function addEffect(key){
 const effect=presets[key];if(!effect)return;
 if(effect.transient){monitor.classList.remove(effect.className);void monitor.offsetWidth;monitor.classList.add(effect.className);setTimeout(()=>monitor.classList.remove(effect.className),1900)}
 else appliedEffects.set(key,effect);
 rebuildFromEffects();renderApplied();
}
function removeEffect(key){appliedEffects.delete(key);rebuildFromEffects();renderApplied()}
ids.forEach(id=>$('#'+id).addEventListener('input',e=>{values[id]=Number(e.target.value);e.target.nextElementSibling.value=units(id,values[id]);apply()}));
function selectClip(key){active=key;const wasPlaying=!video.paused;video.src=clips[key].src;video.load();if(wasPlaying)video.play().catch(()=>{});$('#clipLabel').textContent=clips[key].label;$('#controlClip').textContent=clips[key].label;$$('[data-clip]').forEach(x=>x.classList.toggle('selected',x.dataset.clip===key))}
$$('[data-clip]').forEach(x=>x.addEventListener('click',()=>selectClip(x.dataset.clip)));
$('#playButton').addEventListener('click',()=>video.paused?video.play():video.pause());video.addEventListener('play',()=>$('#playButton').textContent='❚❚');video.addEventListener('pause',()=>$('#playButton').textContent='▶');
$('#prevFrame').addEventListener('click',()=>video.currentTime=Math.max(0,video.currentTime-1/clips[active].fps));$('#nextFrame').addEventListener('click',()=>video.currentTime=Math.min(video.duration||0,video.currentTime+1/clips[active].fps));
function tc(t,fps){if(!Number.isFinite(t))t=0;const frames=Math.floor((t%1)*fps),s=Math.floor(t)%60,m=Math.floor(t/60)%60,h=Math.floor(t/3600);return[h,m,s,frames].map(v=>String(v).padStart(2,'0')).join(':')}
video.addEventListener('loadedmetadata',()=>{$('#duration').textContent=tc(video.duration,clips[active].fps);apply()});video.addEventListener('error',()=>$('#status').textContent='Video load error');video.addEventListener('timeupdate',()=>{$('#currentTime').textContent=tc(video.currentTime,clips[active].fps);$('#playhead').style.left=`calc(42px + ${(video.currentTime/(video.duration||1))*50}%)`});
$$('.fx-toggle').forEach(x=>x.addEventListener('click',()=>{enabled[x.dataset.group]=!enabled[x.dataset.group];x.classList.toggle('active',enabled[x.dataset.group]);apply()}));
$$('[data-preset]').forEach(x=>x.addEventListener('click',()=>{addEffect(x.dataset.preset);x.animate([{background:'#655ac5'},{background:'transparent'}],{duration:500})}));
$('#resetButton').addEventListener('click',()=>{appliedEffects.clear();Object.assign(values,defaults);Object.keys(enabled).forEach(k=>enabled[k]=true);$$('.fx-toggle').forEach(x=>x.classList.add('active'));monitor.classList.remove(...effectClasses);sync();renderApplied();apply()});
$('#effectSearch').addEventListener('input',e=>{const q=e.target.value.toLowerCase();$$('#effectList button').forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(q))});sync();renderApplied();apply();

if(new URLSearchParams(location.search).has('selftest')){
 const report=document.createElement('pre');report.id='selfTestResult';report.hidden=true;document.body.append(report);
 const wait=(event,timeout=8000)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(event+' timeout')),timeout);video.addEventListener(event,()=>{clearTimeout(timer);resolve()},{once:true})});
 (async()=>{const results=[];if(video.readyState<1)await wait('loadedmetadata');results.push({name:'flower metadata',pass:video.videoWidth===1920&&video.videoHeight===1080});addEffect('blur');results.push({name:'blur',pass:getComputedStyle(video).filter.includes('blur(12px)')});addEffect('mirror');results.push({name:'mirror',pass:monitor.classList.contains('fx-mirror')});addEffect('vignette');results.push({name:'vignette',pass:monitor.classList.contains('fx-vignette')});selectClip('car');if(video.readyState<1)await wait('loadedmetadata');results.push({name:'car metadata',pass:video.videoWidth===1920&&video.videoHeight===1080});results.push({name:'effect count',pass:Object.keys(presets).length>=28,detail:Object.keys(presets).length});report.textContent=JSON.stringify({passed:results.every(x=>x.pass),results});report.dataset.done='true';document.title=results.every(x=>x.pass)?'SELFTEST_PASS':'SELFTEST_FAIL'})().catch(error=>{report.textContent=JSON.stringify({passed:false,error:String(error)});report.dataset.done='true';document.title='SELFTEST_FAIL'});
}
