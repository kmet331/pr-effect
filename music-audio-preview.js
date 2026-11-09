// Two independent music clips. The cut stays fixed; media handles overlap around it.
const secondTimelineAudio=document.createElement('audio');
secondTimelineAudio.id='secondTimelineAudio';secondTimelineAudio.src='assets/audio/Gymnopedie-No-1.mp3';
secondTimelineAudio.preload='auto';secondTimelineAudio.hidden=true;document.body.append(secondTimelineAudio);
let musicTransitionClock=null,musicTransitionType=null,musicFadeDuration=3,musicErrorShown=false;
const musicElements=[timelineAudio,secondTimelineAudio];
timelineAudio.preload='auto';
function musicFadeGains(type,p){
 p=Math.max(0,Math.min(1,p));
 if(type==='constantPower')return [Math.cos(p*Math.PI/2),Math.sin(p*Math.PI/2)];
 if(type==='exponential'){const curve=x=>(Math.exp(4*x)-1)/(Math.exp(4)-1);return [curve(1-p),curve(p)];}
 return [1-p,p];
}
function musicFrame(time){
 const cut=clips.flower.duration,half=musicFadeDuration/2;
 if(!musicTransitionType)return {gains:time<cut?[1,0]:[0,1],times:[time,time-cut+half]};
 return {gains:musicFadeGains(musicTransitionType,(time-cut+half)/musicFadeDuration),times:[time,time-cut+half]};
}
function showAudioError(error){if(!musicErrorShown){$('#status').textContent='오디오 재생 실패: '+(error?.message||error)+'. ▶를 다시 눌러 주세요.';musicErrorShown=true;}}
function pauseMusic(){musicElements.forEach(media=>media.pause())}
function waitForMedia(media){return new Promise((resolve,reject)=>{if(media.readyState>=1)return resolve();const timer=setTimeout(()=>{cleanup();reject(new Error('미디어 로딩 시간 초과'))},5000);const cleanup=()=>{clearTimeout(timer);media.removeEventListener('loadedmetadata',ok);media.removeEventListener('error',fail)};const ok=()=>{cleanup();resolve()},fail=()=>{cleanup();reject(new Error('미디어 파일 로딩 실패'))};media.addEventListener('loadedmetadata',ok);media.addEventListener('error',fail)})}
function syncMusic(force=false){
 if(!timelineAudioGraph||!secondAudioGraph)return;
 const time=sequenceAbsoluteTime(),frame=musicFrame(time),playing=musicTransitionClock!==null||!video.paused;
 [timelineAudioGraph,secondAudioGraph].forEach((graph,i)=>{
  const media=musicElements[i],gain=frame.gains[i],target=Math.max(0,frame.times[i]);
  if(graph.musicGain)graph.musicGain.gain.setTargetAtTime(gain,graph.context.currentTime,.008);
  media.dataset.fadeGain=gain.toFixed(4);
  if(media.readyState>=1&&Number.isFinite(media.duration)&&(force||Math.abs(media.currentTime-target)>.22))media.currentTime=Math.min(target,media.duration-.01);
  media.playbackRate=video.playbackRate;
  const needed=playing&&gain>0&&target<media.duration&&time<sequenceDuration;
  if(needed&&media.paused&&!media._playPending){media._playPending=true;media.play().catch(showAudioError).finally(()=>media._playPending=false)}else if(!needed&&!media.paused)media.pause();
 });
 monitor.dataset.musicGains=frame.gains.map(x=>x.toFixed(3)).join('/');
}
function updateMusicUi(){
 const marker=$('#musicTransitionMarker'),cut=clips.flower.duration/sequenceDuration*100;
 marker.hidden=!musicTransitionType;
 marker.style.left=`calc(42px + (100% - 42px) * ${(clips.flower.duration-musicFadeDuration/2)/sequenceDuration})`;
 marker.style.width=`calc((100% - 42px) * ${musicFadeDuration/sequenceDuration})`;
 marker.textContent=musicTransitionType?$('#audioTransitionType').selectedOptions[0].textContent:'';
 $('#removeMusicTransition').disabled=!musicTransitionType;
}
function setMusicTransition(type){musicTransitionType=type||null;$('#audioTransitionType').value=type||'';updateMusicUi();syncMusic(true);renderCatalog()}
async function previewMusicTransition(){
 if(transitioning)return;
 try{
  if(!musicTransitionType)setMusicTransition('constantPower');
  await Promise.all([setupAudio(),setupTimelineAudio()]);
  video.pause();selectClip('flower');await waitForMedia(video);
  video.currentTime=Math.max(0,clips.flower.duration-musicFadeDuration/2-2);
  await video.play();musicErrorShown=false;syncMusic(true);
 }catch(error){showAudioError(error)}
}
$('#audioTransitionType').addEventListener('change',()=>setMusicTransition($('#audioTransitionType').value));
$('#musicFadeDuration').addEventListener('input',event=>{musicFadeDuration=Number(event.target.value);$('#musicFadeValue').textContent=musicFadeDuration.toFixed(1)+'s';updateMusicUi();syncMusic(true)});
$('#previewMusicTransition').onclick=previewMusicTransition;
$('#removeMusicTransition').onclick=()=>setMusicTransition(null);
musicElements.forEach(media=>media.addEventListener('error',()=>showAudioError(new Error(media.id+' 파일을 불러올 수 없습니다'))));
musicCredit.innerHTML+=' · <a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100787" target="_blank" rel="noopener">Gymnopedie No. 1</a> — Kevin MacLeod (Satie), CC BY 4.0, 45-second excerpt';
setMusicTransition(null);
setInterval(()=>syncMusic(),30);

// Diagnostic values are measured after effects AND crossfade gain, before the device output.
setInterval(()=>{[timelineAudioGraph,secondAudioGraph].forEach((graph,i)=>{if(!graph?.outputAnalyser)return;const data=new Float32Array(graph.outputAnalyser.fftSize);graph.outputAnalyser.getFloatTimeDomainData(data);musicElements[i].dataset.outputRms=Math.sqrt(data.reduce((sum,v)=>sum+v*v,0)/data.length).toFixed(6);musicElements[i].dataset.contextState=graph.context.state;musicElements[i].dataset.humType=graph.hum.type;})},100);
