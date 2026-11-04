const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const video=$('#programVideo'),monitor=$('#monitor');
const clips={flower:{src:'assets/videos/9054643-hd_1920_1080_30fps.mp4',label:'꽃_30fps.mp4',fps:30},car:{src:'assets/videos/5057527-hd_1920_1080_25fps.mp4',label:'자동차_25fps.mp4',fps:25}};
const baseDefaults={positionX:0,positionY:0,scale:100,rotation:0,opacity:100};
const effectDefaults={brightness:100,contrast:100,saturation:100,hue:0,blur:0};
const values={...baseDefaults,...effectDefaults},enabled={motion:true,opacity:true,time:true};
const baseIds=Object.keys(baseDefaults),effectClasses=['fx-mirror','fx-flip','fx-lens','fx-basic3d','fx-wave','fx-mosaic','fx-vignette','fx-grid','fx-gradient','fx-noise','fx-scanlines','fx-glow','fx-emboss','fx-edges','fx-posterize','fx-invert','fx-strobe','fx-dissolve','fx-dipBlack','fx-wipe','fx-directional'];
const appliedEffects=new Map();let active='flower';
const paramDefs={
 blur:{label:'Blurriness',min:0,max:24,unit:'px'},brightness:{label:'Brightness',min:20,max:180,unit:'%'},contrast:{label:'Contrast',min:20,max:200,unit:'%'},saturation:{label:'Saturation',min:0,max:220,unit:'%'},hue:{label:'Hue',min:-180,max:180,unit:'°'},scale:{label:'Scale',min:50,max:180,unit:'%'},rotation:{label:'Rotation',min:-30,max:30,unit:'°'}
};
const presets={
 blur:{label:'Gaussian Blur',values:{blur:12}},directionalBlur:{label:'Directional Blur',className:'fx-directional',values:{blur:2}},sharpen:{label:'Sharpen',values:{contrast:145,saturation:120}},
 vivid:{label:'Lumetri Color · Vivid',values:{brightness:108,contrast:125,saturation:165}},mono:{label:'Black & White',values:{saturation:0,contrast:115}},brightContrast:{label:'Brightness & Contrast',values:{brightness:125,contrast:140}},warm:{label:'Color Balance · Warm',values:{hue:-12,saturation:125,brightness:106}},cool:{label:'Color Balance · Cool',values:{hue:18,saturation:118,brightness:102}},hueShift:{label:'Hue/Saturation',values:{hue:90,saturation:145}},faded:{label:'Faded Film',values:{brightness:112,contrast:78,saturation:72}},invert:{label:'Invert',className:'fx-invert'},
 tilt:{label:'Transform · Tilt',values:{rotation:-6,scale:112}},mirror:{label:'Mirror',className:'fx-mirror'},flip:{label:'Vertical Flip',className:'fx-flip'},lens:{label:'Lens Distortion',className:'fx-lens'},wave:{label:'Wave Warp',className:'fx-wave'},grid:{label:'Grid',className:'fx-grid'},gradient:{label:'4-Color Gradient',className:'fx-gradient'},noise:{label:'Noise',className:'fx-noise'},basic3d:{label:'Basic 3D',className:'fx-basic3d'},
 emboss:{label:'Emboss',className:'fx-emboss'},edges:{label:'Find Edges',className:'fx-edges'},mosaic:{label:'Mosaic',className:'fx-mosaic'},posterize:{label:'Posterize',className:'fx-posterize'},vignette:{label:'Vignette',className:'fx-vignette'},glow:{label:'Glow',className:'fx-glow'},scanlines:{label:'Scan Lines',className:'fx-scanlines'},strobe:{label:'Strobe Light',className:'fx-strobe'},
 dissolve:{label:'Cross Dissolve',className:'fx-dissolve',transient:true},dipBlack:{label:'Dip to Black',className:'fx-dipBlack',transient:true},wipe:{label:'Linear Wipe',className:'fx-wipe',transient:true}
};
const units=(id,v)=>paramDefs[id]?v+paramDefs[id].unit:['scale','opacity'].includes(id)?v+'%':['rotation'].includes(id)?v+'°':String(v);
function apply(){
 const tx=enabled.motion?values.positionX:0,ty=enabled.motion?values.positionY:0,sc=enabled.motion?values.scale:100,rot=enabled.motion?values.rotation:0;
 const filter=`brightness(${values.brightness}%) contrast(${values.contrast}%) saturate(${values.saturation}%) hue-rotate(${values.hue}deg) blur(${values.blur}px)`;
 monitor.style.setProperty('--base-transform',`translate(${tx}px,${ty}px) scale(${sc/100}) rotate(${rot}deg)`);monitor.style.setProperty('--base-filter',filter);video.style.opacity=(enabled.opacity?values.opacity:100)/100;
 $('#status').textContent=`FX ${appliedEffects.size} · ${active==='flower'?'꽃':'자동차'} · ${values.blur}px Blur`;
}
function syncBase(){baseIds.forEach(id=>{const input=$('#'+id);if(input){input.value=values[id];input.nextElementSibling.value=units(id,values[id])}})}
function rebuildFromEffects(){
 Object.assign(values,effectDefaults);monitor.classList.remove(...effectClasses);
 appliedEffects.forEach(effect=>{if(!effect.enabled)return;if(effect.values)Object.assign(values,effect.values);if(effect.className)monitor.classList.add(effect.className)});syncBase();apply();
}
function renderDynamicControls(){
 const host=$('#dynamicControls');host.innerHTML='';
 appliedEffects.forEach((effect,key)=>{
  const section=document.createElement('section');section.className='control-group dynamic-control'+(effect.enabled?'':' disabled-fx');section.dataset.effect=key;
  const heading=document.createElement('h3');const toggle=document.createElement('button');toggle.className='fx-toggle'+(effect.enabled?' active':'');toggle.textContent='fx';toggle.addEventListener('click',()=>{effect.enabled=!effect.enabled;renderDynamicControls();rebuildFromEffects()});
  const title=document.createElement('span');title.textContent=effect.label;const remove=document.createElement('button');remove.className='remove-fx';remove.textContent='×';remove.title='Remove Effect';remove.addEventListener('click',()=>removeEffect(key));heading.append(toggle,title,remove);section.append(heading);
  if(effect.values)Object.entries(effect.values).forEach(([param,value])=>{const def=paramDefs[param];if(!def)return;const label=document.createElement('label');label.append(document.createTextNode(def.label+' '));const input=document.createElement('input');input.type='range';input.min=def.min;input.max=def.max;input.value=value;input.dataset.param=param;const output=document.createElement('output');output.value=units(param,value);input.addEventListener('input',()=>{effect.values[param]=Number(input.value);output.value=units(param,effect.values[param]);rebuildFromEffects()});label.append(input,output);section.append(label)});
  if(!effect.values){const state=document.createElement('div');state.className='effect-state';state.textContent='Effect applied';section.append(state)}host.append(section);
 });
 $$('[data-preset]').forEach(button=>button.classList.toggle('applied',appliedEffects.has(button.dataset.preset)));
}
function addEffect(key){const template=presets[key];if(!template)return;if(template.transient){monitor.classList.remove(template.className);void monitor.offsetWidth;monitor.classList.add(template.className);setTimeout(()=>monitor.classList.remove(template.className),1900);return}if(!appliedEffects.has(key))appliedEffects.set(key,{...template,values:template.values?{...template.values}:null,enabled:true});renderDynamicControls();rebuildFromEffects()}
function removeEffect(key){appliedEffects.delete(key);renderDynamicControls();rebuildFromEffects()}
baseIds.forEach(id=>$('#'+id).addEventListener('input',e=>{values[id]=Number(e.target.value);e.target.nextElementSibling.value=units(id,values[id]);apply()}));
$('#speed').addEventListener('input',e=>{const speed=Number(e.target.value);e.target.nextElementSibling.value=speed+'%';video.playbackRate=enabled.time?speed/100:1});
$$('.fx-toggle[data-group]').forEach(button=>button.addEventListener('click',()=>{const group=button.dataset.group;enabled[group]=!enabled[group];button.classList.toggle('active',enabled[group]);if(group==='time')video.playbackRate=enabled.time?Number($('#speed').value)/100:1;apply()}));
function selectClip(key){active=key;const wasPlaying=!video.paused;video.src=clips[key].src;video.load();if(wasPlaying)video.play().catch(()=>{});$('#clipLabel').textContent=clips[key].label;$('#controlClip').textContent=clips[key].label;$$('[data-clip]').forEach(x=>x.classList.toggle('selected',x.dataset.clip===key));apply()}
$$('[data-clip]').forEach(x=>x.addEventListener('click',()=>selectClip(x.dataset.clip)));$$('[data-preset]').forEach(x=>x.addEventListener('click',()=>addEffect(x.dataset.preset)));
$('#playButton').addEventListener('click',()=>video.paused?video.play():video.pause());video.addEventListener('play',()=>$('#playButton').textContent='❚❚');video.addEventListener('pause',()=>$('#playButton').textContent='▶');
$('#prevFrame').addEventListener('click',()=>video.currentTime=Math.max(0,video.currentTime-1/clips[active].fps));$('#nextFrame').addEventListener('click',()=>video.currentTime=Math.min(video.duration||0,video.currentTime+1/clips[active].fps));
function tc(t,fps){if(!Number.isFinite(t))t=0;const f=Math.floor((t%1)*fps),s=Math.floor(t)%60,m=Math.floor(t/60)%60,h=Math.floor(t/3600);return[h,m,s,f].map(v=>String(v).padStart(2,'0')).join(':')}
video.addEventListener('loadedmetadata',()=>{$('#duration').textContent=tc(video.duration,clips[active].fps);apply()});video.addEventListener('error',()=>$('#status').textContent='Video load error');video.addEventListener('timeupdate',()=>{$('#currentTime').textContent=tc(video.currentTime,clips[active].fps);$('#playhead').style.left=`calc(42px + ${(video.currentTime/(video.duration||1))*50}%)`});
$('#resetButton').addEventListener('click',()=>{appliedEffects.clear();Object.assign(values,baseDefaults,effectDefaults);Object.keys(enabled).forEach(k=>enabled[k]=true);$$('.fx-toggle[data-group]').forEach(x=>x.classList.add('active'));$('#speed').value=100;$('#speed').nextElementSibling.value='100%';video.playbackRate=1;monitor.classList.remove(...effectClasses);syncBase();renderDynamicControls();apply()});
$('#effectSearch').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();$$('#effectList [data-preset]').forEach(button=>{const match=button.textContent.toLowerCase().includes(q);button.hidden=q&&!match;if(match&&q){let parent=button.parentElement;while(parent&&parent.id!=='effectList'){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}}});});
syncBase();renderDynamicControls();apply();

if(new URLSearchParams(location.search).has('selftest')){
 const report=document.createElement('pre');report.id='selfTestResult';report.hidden=true;document.body.append(report);const wait=(event,timeout=8000)=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error(event+' timeout')),timeout);video.addEventListener(event,()=>{clearTimeout(timer);resolve()},{once:true})});
 (async()=>{const results=[];if(video.readyState<1)await wait('loadedmetadata');results.push({name:'default controls',pass:$$('#dynamicControls .dynamic-control').length===0&&!!$('#speed')});const firstFolder=$('#effectList details details');firstFolder.open=false;results.push({name:'folder collapse',pass:!firstFolder.open});firstFolder.open=true;addEffect('blur');results.push({name:'blur controls',pass:!!$('#dynamicControls [data-effect="blur"]')&&getComputedStyle(video).filter.includes('blur(12px)')});addEffect('vivid');results.push({name:'lumetri dynamic',pass:!!$('#dynamicControls [data-effect="vivid"]')});removeEffect('blur');results.push({name:'remove effect',pass:!$('#dynamicControls [data-effect="blur"]')});selectClip('car');if(video.readyState<1)await wait('loadedmetadata');results.push({name:'car metadata',pass:video.videoWidth===1920&&video.videoHeight===1080});results.push({name:'effect count',pass:Object.keys(presets).length===31,detail:Object.keys(presets).length});report.textContent=JSON.stringify({passed:results.every(x=>x.pass),results});report.dataset.done='true';document.title=results.every(x=>x.pass)?'SELFTEST_PASS':'SELFTEST_FAIL'})().catch(error=>{report.textContent=JSON.stringify({passed:false,error:String(error)});report.dataset.done='true';document.title='SELFTEST_FAIL'});
}
