# Browser Test Report

## 2026-11-05 final handoff regression

- Rechecked the latest normal page from a fresh browser state. The real flower MP4 loaded at `readyState=4`, duration 18.5185 s. With the timeline range focused, Space advanced the playhead from 0 to 13/1000 and media time to 0.6975 s, then paused normally.
- Student effect flow passed: searched and added Gaussian Blur, entered 24 numerically, added Lumetri Color, observed `FX 2` with blur 24 px, disabled Gaussian and observed blur return to 0 without removing Lumetri, re-enabled Gaussian, removed Lumetri, and retained `FX 1` / blur 24 px. The car clip stayed `FX 0` / blur 0; returning to flower restored `FX 1` / blur 24.
- Transition flow passed: applied Wipe and observed one transition removal control, replaced it with Slide and observed timeline marker title `Slide · Start at Cut · 근사`, then deleted it and confirmed the marker/control disappeared.
- Reload returned to `FX 0 · flower · blur 0px · audio 100%`, no transition marker, and the auxiliary lab closed. The final query regression returned `SELFTEST_PASS`; catalog remained 145 interactive / 128 reference-only / 273 total; no browser warning/error logs were recorded.
- Verified on this PC only: `http://localhost:4187/` and `http://127.0.0.1:4187/`. No LAN/other-device reachability, external hosting, push, deployment, or install was performed.
- Still not executed or not claimed: subjective listening quality; mobile touch/device testing; real-time Pitch Shifter or FFT streaming on the video timeline; arbitrary FFT curve drawing; long-file memory/CPU testing; Adobe-identical algorithms; HDR/360/Ambisonics/ML tracking/restoration and proprietary Film Impact rendering. Required fixtures remain documented in the implementation-gate section below.

## 2026-11-05 auxiliary lab placement and FFT Filter experiment

- Moved Pitch Shift Lab under a collapsed `보조 실험실 · Premiere 실시간 효과 아님` disclosure in Properties. The normal Premiere-like workspace now shows only the disclosure summary; the controls appear only when a student deliberately expands the auxiliary area.
- Implemented a real 2,048-point STFT bin-gain experiment with 512-sample overlap-add hop and three distinct curves: 2 kHz low-pass, 300-3,400 Hz telephone band-pass, and a narrow 1 kHz notch. Identity is a sample-exact bypass (`neutralError=0`), not a processed approximation.
- Multitone response passed on 100/500/1,000/4,000/10,000 Hz input. Low-pass retained 500 Hz at 1.000x while reducing 4 kHz to 0.0624x and 10 kHz to 0.00158x. Telephone reduced 100 Hz to 0.0152x, retained 500 Hz at 0.991x and 1 kHz at 0.9996x, and reduced 10 kHz to 0.0133x. Notch reduced 1 kHz to 0.0630x while retaining 500 Hz at 1.0007x and 4 kHz at 0.99997x.
- A 10 ms cosine edge fade removed STFT startup normalization spikes. Final maximum adjacent steps were 0.0290 (low-pass), 0.0529 (telephone), and 0.1869 (notch), versus pre-fade spikes above 1.0 for telephone/notch. Two seconds processed in roughly 64-74 ms in the test browser.
- VoiceBank Clean telephone filtering retained exactly 83,582 samples / 1.7413 seconds, processed in about 63 ms in the isolated test and about 112 ms through the page UI, remained finite/non-silent, and had maximum adjacent step 0.0947.
- Added the validated curves to the same collapsed auxiliary lab as an **offline sample-only FFT Filter Lab**. A rendered Blob retained 1.741292 seconds; Space advanced it to 0.451 s, pause and seek reached 0.0174 s, and removal restored the original clean WAV at the same seek position. While FFT preview is active, Pitch rendering is disabled; after removal it is enabled again. Existing Volume at 60% remained in the sample audio graph (`processed=true`) while the telephone-rendered source played.
- The catalog `FFT Filter` remains reference-only. The lab explicitly says it is an STFT bin-gain approximation and does not reproduce Adobe's free-drawn curve UI or real-time streaming processor. It is not connected to the flower/car timeline. Subjective listening and arbitrary user-drawn curve editing remain unverified.

## 2026-11-05 offline Pitch Shift Lab integration

- Added a deliberately separate **Pitch Shift Lab · offline sample only** beneath the VoiceBank A/B player. It offers +7 and -5 semitone STFT renders, shows channel count, preserved duration, and render time, and explicitly states that it is not the video timeline or Premiere's real-time Pitch Shifter. The catalog `Pitch Shifter` card remains reference-only, so the 145/128/273 count is unchanged.
- Real Clean VoiceBank flow passed: +7 rendered the 1-channel 83,582-sample / 1.741-second source to a WAV Blob in roughly 249 ms, and the native audio player reported the same 1.741292-second duration. Space advanced playback from 0 to 0.52 s and paused it; Home plus ArrowRight sought to 0.0174 s while paused. Removing the preview restored the original `assets/audio/voicebank-p232_001-clean.wav` URL and retained the seek position.
- -5 rendering also retained 1.741292 seconds. Clicking `Noisy` while the rendered Blob was selected revoked the preview state and switched to the original noisy WAV; the lab reported `pitchPreview=off`. Selecting the car video clip did not attach or transfer the sample-only processor to the video: the Effect Controls changed to the car while the independent VoiceBank Blob state stayed unchanged until explicit removal.
- The provided VoiceBank fixtures are mono (1 channel, 48 kHz). A query-only synthetic stereo regression therefore used independent 440 Hz left and 660 Hz right channels. +7 semitones produced 659 Hz left (target 659.26) and 989 Hz right (target 988.88), retaining exactly 48,000 samples in each channel. This validates independent channel processing, not subjective stereo imaging quality.
- The preview uses native audio-element play/pause/seeking after the offline render and a 10 ms cosine boundary fade. It does not synchronize with the flower/car sequence timeline by design, and the UI states that limitation. Subjective listening, formant preservation, long media, and continuous real-time seek/pause boundaries remain unverified; those are why the actual effect card is not promoted.

## 2026-11-05 STFT phase-vocoder and resampling experiment

- Added a query-only test harness (`?vocoderpitchtest`) that is not loaded during the normal lesson page. It performs a 2,048-point Hann-window STFT, 256-sample analysis hop, phase-unwrapped synthesis with a pitch-ratio-scaled hop, overlap-add normalization, and linear resampling back to the original sample count. Zero semitones explicitly bypasses processing.
- Generated-tone verification passed at 48 kHz for 96,000 samples / 2.000 seconds: neutral 440 Hz measured 440 Hz; +7 semitones targeted 659.26 Hz and measured **659 Hz**; -5 semitones targeted 329.63 Hz and measured **330 Hz**. All outputs retained exactly 96,000 samples and 2.000 seconds.
- A 10 ms cosine edge fade was required after resampling. Before it, the largest adjacent-sample discontinuities occurred at sample 5 (+7) and sample 9 (-5), with +7 reaching 0.272. After the fade, maximum steps were 0.0848 (+7) and 0.0282 (-5), first/last output samples were zero, and the click threshold (<0.2) passed. Neutral bypass remained sample-identical (`neutralError=0`).
- Processing time in this browser was approximately 507 ms (+7) and 324 ms (-5) for each 2-second mono tone. The 1.7413-second VoiceBank clean speech channel retained exactly 83,582 samples and 1.7413 seconds, processed in about 151 ms, remained finite/non-silent (RMS 0.0570, peak 0.398), and had maximum adjacent step 0.117.
- The offline DSP experiment passed its numeric gates, but `Pitch Shifter` remains reference-only. The normal page is unchanged because real-time streaming AudioWorklet buffering, multi-channel continuity across seek/pause/clip changes, latency reporting, formant behavior, and subjective speech intelligibility have not yet been validated. The earlier failed delay-modulation implementation remains removed.

## 2026-11-05 Pitch Shifter granular feasibility experiment

- Built an isolated AudioWorklet experiment with two time-varying circular-buffer read heads, 2,048-sample Hann crossfades, and equal-length real-time output. It was tested with a generated 440 Hz sine for neutral, +7 semitones, and -5 semitones at 48 kHz for exactly 96,000 output samples (2.000 seconds each).
- Duration preservation passed, but pitch correctness failed. A zero-crossing estimate initially reported a misleading +7-semitone sideband near 674 Hz; a direct 250-800 Hz spectral scan showed the dominant component remained **440 Hz** for neutral, +7, and -5 settings. Targets were 659.26 Hz and 329.63 Hz. The processor produced modulation/sidebands rather than a stable pitch transposition.
- The experimental UI, AudioWorklet, preset mapping, and script include were removed. `Pitch Shifter` remains reference-only and the catalog remains 145/128/273. This prevents a length-preserving but musically incorrect delay modulation from being taught as granular pitch shifting.
- A safe next attempt needs a true overlap-add phase vocoder or WSOLA/granular engine with analysis/synthesis hop control, transient handling, and formant limits. Acceptance should include dominant-frequency error, output duration, boundary-click energy, speech intelligibility, and CPU/latency measurements on both VoiceBank and generated tones.

## 2026-11-05 remaining 128 reference-item implementation gate

- Re-enumerated every disabled card from the rendered 25.6.4 tree. No item was promoted in this pass: all remaining candidates require an input, analysis stage, or proprietary behavior that the current flower/car/VoiceBank/chroma fixtures cannot validate without teaching a different effect under the Adobe name.
- High classroom-value blockers were checked against Adobe documentation:
  - `Pitch Shifter` must change pitch without changing duration. A media `playbackRate` control is therefore not an acceptable substitute; a verified phase-vocoder or granular pitch engine plus musical-tone/speech fixtures is required.
  - `FFT Filter` is a user-drawn spectral curve/notch processor. Reusing the existing Graphic EQ or a single Biquad node would not reproduce its FFT-domain curve behavior; it needs an overlap-add FFT processor and impulse/frequency-sweep validation.
  - `Auto Reframe` generates motion keyframes that follow detected action. It needs subject detection/tracking footage and an analysis pipeline, not a fixed center crop.
  - `Warp Stabilizer` needs motion analysis, stabilization method selection, and border handling. It needs a deliberately shaky clip with known camera motion and a multi-frame tracker.
  - `Morph Cut` is intended for single-talking-head jump cuts on a static background. The flower/car pair is not a valid input; it needs paired interview takes and face-aware temporal morphing.
  - `Binauralizer - Ambisonics`, `Panner - Ambisonics`, and the VR family require an actual multichannel Ambisonics source and equirectangular 360/VR video. Stereo VoiceBank and ordinary 16:9 MP4s cannot validate spatial-sphere rotation or binaural decoding.
- Remaining Film Impact cards are installed plug-in names whose proprietary parameters and rendering are not exposed by the current samples. They remain reference-only rather than aliases for generic blur, wipe, glow, shake, or distortion effects.
- Concrete additional inputs needed for the next safe promotions: (1) licensed dry tonal/speech audio plus expected pitch-shift references; (2) impulse and logarithmic sweep fixtures for FFT filtering; (3) a short shaky clip with a stable ground-truth crop; (4) two licensed talking-head takes separated by a jump cut; (5) first-order Ambisonics audio paired with licensed equirectangular 360 video; and (6) Film Impact reference renders or vendor parameter documentation for each plug-in family.
- Sources consulted: Adobe audio effects library (`https://helpx.adobe.com/premiere/desktop/add-audio-effects/apply-audio-effects/audio-effects-library.html`), FFT Filter documentation (`https://helpx.adobe.com/audition/desktop/effects-reference/filter-equalizer-effects.html`), Auto Reframe (`https://helpx.adobe.com/premiere/desktop/add-video-effects/commonly-used-effects/auto-reframe-overview.html`), Warp Stabilizer settings (`https://helpx.adobe.com/premiere/desktop/add-video-effects/commonly-used-effects/warp-stabilizer-settings.html`), Morph Cut (`https://helpx.adobe.com/africa/premiere/desktop/add-video-effects/apply-video-transitions/apply-morph-cut-to-smoothen-jump-cuts.html`), and Ambisonics monitoring (`https://helpx.adobe.com/premiere/desktop/edit-projects/edit-vr-content/monitor-ambisonics-audio.html`).

## 2026-11-05 final common classroom workflow audit

- Audited the first-use student path at a 1280x720 viewport: search `Gaussian Blur`, add it to the flower clip, enter `35` numerically, play/pause, focus the timeline scrubber and toggle playback with Space, select the car clip, add and adjust `Crop`, return between clips, apply `Wipe`, replace it with `Slide`, and remove the transition. The scrubber advanced from `322` to `334` while it retained focus; clip effect state remained isolated; the transition marker changed from `Wipe · Start at Cut · 근사` to `Slide · Start at Cut · 근사`, then disappeared after removal.
- Fixed one student-facing default-value defect: adding `Crop` previously cut 8% from all four sides immediately. Crop now starts neutrally at Top/Right/Bottom/Left `0%`, matching the expected add-then-adjust workflow. A browser reload confirmed all four controls at `0%`; entering Left `25%` changed only the car clip, and deleting the card restored `FX 0`.
- Rechecked the high-frequency teaching set against the measured 25.6.4 catalog. The most useful currently interactive paths are Motion/Opacity/Time Remapping, Lumetri Color and basic color controls, Crop/Transform/Flip, Gaussian/Directional Blur, Sharpen/Unsharp Mask, Drop Shadow, Ultra/Color/Luma/Track Matte keying, Posterize Time/Echo, Volume/Mute/Balance, EQ/compression/limiting/de-essing/delay/reverb, Cross/Film/Dip/Wipe/Slide/Push transitions, and Constant Power/Gain/Exponential Fade audio transitions. Cards remain labeled `근사`; no browser effect is claimed to be Adobe-identical.
- `Volume` was also reapplied through the visible Audio Effects tree and exposed a neutral 100% Gain control. Existing offline PCM tests remain the evidence for audio processing; this pass did not perform subjective listening.
- Current catalog remains **145 interactive / 128 reference-only / 273 total**. Reference-only items still need the specific media/algorithms listed in the remaining-input audit below; mobile touch gestures and subjective audio quality were not executed in this pass.

## 2026-11-05 local preview availability and remaining-input audit

- Verified the existing preview server without restarting or replacing it. Both `http://localhost:4187/` and `http://127.0.0.1:4187/` returned HTTP **200**, 6,316 HTML bytes, and title `Premiere Effects Lab`. The last browser regression remained `SELFTEST_PASS` with both real videos ready.
- These addresses are verified only on this PC. No LAN bind address, firewall allowance, router path, or second-device access was established, so the page must not be described as reachable from another device. No external deployment, tunnel, upload, push, or additional server process was created.
- High-priority reference candidates were rechecked after Directional Blur. The following remain blocked by specific missing inputs or algorithms rather than being treated as generic CSS effects:
  - `SDR Conform`: needs a tagged HDR/PQ or HLG source and verified tone-map targets; the current SDR flower/car clips cannot demonstrate it.
  - `Roughen Edges`: needs a meaningful alpha boundary and a verified fractal alpha erosion/dilation pipeline; displacing RGB pixels would teach the wrong effect.
  - `Brush Strokes`: requires a directional stroke kernel/texture synthesis model; a turbulence overlay is not equivalent.
  - `Cineon Converter`: needs known log-film/Cineon material and calibrated black/white/gamma conversion values.
  - `Automatic Click Remover`, `DeNoise`, and `DeReverb`: require transient/noise/room models and paired fixtures; the existing clean/noisy/reverberant speech is useful for validation but does not itself supply the restoration algorithms.
  - `Pitch Shifter`: requires time-preserving granular/phase-vocoder processing; changing playback rate would incorrectly change duration.
- No additional effect was promoted in this pass because none of these remaining candidates could be validated from the current inputs without a materially misleading substitute.

## 2026-11-05 Directional Blur GPU implementation

- Restored **Directional Blur** from reference-only only after replacing the incorrect X/Y Gaussian substitute with a dedicated WebGL line kernel. Every output pixel averages 21 symmetric texture samples along the selected Direction and Blur Length; texture coordinates are clamped so edge pixels repeat instead of fading to transparent.
- Direction/length tests passed on the real 1920x1080 flower MP4: 0°/24 px reported vector `24.00/0.00`; length 0 reported `0.00/0.00` and samples the same pixel 21 times, producing the original frame; 90°/80 px reported `0.00/80.00`. The canvas rendered at the source 1920x1080 size with 21 samples.
- Composition with Spherize passed in the documented fixed pipeline: `webgl-warp-active` and `directional-blur-active` were both true, the Spherize WebGL canvas remained the source for the directional pass, and the fixed-order warning stayed visible. This does not claim Premiere's arbitrary effect-stack ordering.
- Playback advanced from 0 to 0.93 s while the 21-sample blur remained active, with no browser warning/error logs. Toggle exposed the underlying Spherize output; car stayed neutral; flower restored the 90°/80 px settings; removing Directional Blur preserved Spherize.
- Approximation limits shown in the card: fixed 21-sample quality, nearest-edge repeat behavior, no adaptive larger kernel, and no claim of Adobe's exact sample weights or quality modes.
- Catalog after promotion: **145 interactive / 128 reference-only / 273 total**, `SELFTEST_PASS`, real video `readyState=4`.

## 2026-11-05 playback-driven effect audit

- **Strobe Light** was rebuilt from a fixed CSS animation into a sequence-time effect with Strobe Period, Strobe Duration, and Strobe Opacity. It uses a dedicated layer rather than sharing the general overlay, so it does not overwrite Lightning/gradient state. With 1000 ms period, 20% duration, and 70% opacity, seeking to 0.080 s reported `0.080/on/0.70`; seeking to 0.518 s reported `0.518/off/0.00`. Playback advanced the phase, pause preserved timeline time, and seeking recomputed it deterministically.
- Strobe toggle set the layer to opacity 0 and dataset state `inactive`; car had no card and a neutral layer; returning to flower restored `on/0.70`; removal cleared the card and opacity. This now follows playback/seeking instead of changing merely because wall-clock CSS animation was running. Premiere random phase, strobe color, blend operator, and layer-transparency modes remain explicitly unmodeled.
- **Directional Blur was demoted to reference-only.** The prior implementation set horizontal/vertical `feGaussianBlur` standard deviations, which is an anisotropic Gaussian blur rather than sampling pixels along an angle/distance vector. A correct promotion requires a multi-sample line-blur shader with Direction and Blur Length plus bounded edge handling; the current name would otherwise teach the wrong spatial kernel.
- The earlier **Vocal Enhancer** demotion remains in force; no simple EQ/compressor chain is presented as Adobe's mode-specific voice processor.
- Final result: **144 interactive / 129 reference-only / 273 total**, `SELFTEST_PASS`, real video `readyState=4`, and no browser warning/error logs.

## 2026-11-05 common video/audio effect semantics audit

- Compared common effects with Adobe's effect inventory and audio descriptions (`https://helpx.adobe.com/premiere/desktop/add-video-effects/effects-and-transitions-library/list-of-effects-and-transitions.html` and `https://helpx.adobe.com/premiere/desktop/add-audio-effects/apply-audio-effects/audio-effects-library.html`). Two formerly fixed CSS demonstrations were upgraded and one misleading audio preset was demoted.
- **Basic 3D** now exposes independent Swivel, Tilt, and Distance to Image controls and applies them as a perspective transform to the active real-video output canvas. The default `24° / 10° / 18` produced a nontrivial 3D matrix; `0° / 0° / 0` restored an undistorted plane. The card states that Premiere specular highlight controls and exact camera calibration are not modeled.
- **Drop Shadow** now derives a real shadow from the rendered alpha and exposes Direction, Distance, Softness, and Opacity instead of the former fixed `16px 16px 12px` CSS decoration. Direction 90°, distance 30, softness 20, opacity 60% produced `drop-shadow(... 0px 30px 20px / 0.6)`; opacity 0 produced a transparent shadow. Flower/car isolation and restoration passed.
- **Vocal Enhancer was demoted to reference-only.** The prior 80 Hz high-pass + presence EQ + compressor chain did not implement Adobe's Male/Female/Music modes, automatic sibilance/plosive reduction, microphone modeling, or mode-specific compression. Calling that chain Vocal Enhancer would misteach the effect even with an approximation badge. The Effects entry is now disabled.
- Audited audio controls retained as meaningful approximations: Channel Volume uses independent channel gains, Channel Mixer/Fill/Swap use an actual stereo matrix, DeEsser uses a split high-frequency compression path, Single-band Compressor and dynamics controls use real compressor/transfer nodes, and Hard Limiter uses an explicit sample ceiling while clearly disclaiming true-peak/look-ahead equivalence. DeNoise, DeReverb, Loudness Meter/Radar, Mastering, Pitch Shifter, and Ambisonics remain reference-only.
- Final result: **145 interactive / 128 reference-only / 273 total**, `SELFTEST_PASS`, real video `readyState=4`, and no browser warning/error logs.

## 2026-11-05 Adobe transition semantics audit

- Compared implemented dissolve behavior with Adobe's official dissolve descriptions (`https://helpx.adobe.com/premiere/desktop/add-video-effects/effects-and-transitions-library/list-of-video-dissolve-transitions.html`) and standard transition behavior with Adobe's transition documentation. This audit corrected three materially misleading shortcuts.
- **Film Dissolve** now blends the two actual frames in linear-light RGB (sRGB decode → linear interpolation → sRGB encode), matching Adobe's documented gamma-1.0 core behavior. The former nonlinear opacity curve was removed. At progress 0.156, the 640x360 processing canvas reported the same linear progress, both source videos were ready, and both underlying video elements were hidden. Completion hid the canvas, restored opacity 1, selected the destination clip, and enabled the scrubber. Adobe color-management precision and high-bit-depth processing remain outside this browser approximation.
- **Slide** no longer moves both clips like Push. The outgoing clip stays stationary while the incoming clip slides over it. At progress 0.493 the outgoing transform was `none`, while the incoming frame was translated 244 px with opacity 1. **Push** retains the separate both-clips-moving behavior.
- **Split** no longer duplicates a center-reveal mask. It now uses live top and bottom copies of the outgoing frame, clipped to separate halves and translated apart vertically over the incoming clip. At progress 0.449 the halves were translated -133.86/+133.86 px and both real videos were ready. **Center Split** remains the distinct left/right split implementation. Completion hid both layers, restored opacity, selected the destination clip, and enabled the scrubber.
- **Non-Additive Dissolve** remains reference-only and absent from the direct dropdown; Adobe's current public description is qualitative and the earlier outgoing-luma threshold was not a verified implementation.
- Other audited core mappings remain distinguishable approximations rather than plain Cross Dissolve aliases: Additive uses screen/additive compositing, Dip transitions pass through black/white, Push moves both clips, Iris transitions use their named masks, Wipe/Inset/Barn Doors use distinct edge/panel masks, and Cross Zoom changes scale and opacity. Legacy patterned transitions remain explicitly approximate.
- Final regression: **146 interactive / 127 reference-only / 273 total**, `SELFTEST_PASS`, both videos ready, and no browser warning/error logs.

## 2026-11-05 Corner Pin homography and Non-Additive correction

- Promoted **Corner Pin** after implementing an inverse projective homography over the actual video at a bounded 480x270 processing size. Eight independent controls set X/Y for Top Left, Top Right, Bottom Left, and Bottom Right. Pixels outside the destination quadrilateral remain transparent; nearest-neighbor resampling is used for predictable browser performance.
- Identity-corner verification passed: `(0,0) (100,0) (0,100) (100,100)` produced matrix `1/0/0/0/1/0/0/0` and mapped all **129,600 / 129,600** pixels. Moving only Top Left to `(30,20)` produced a non-affine projective matrix and mapped **96,867** pixels, confirming independent-corner geometry rather than crop/clip-path substitution.
- Corner Pin + Spherize composition passed through the established pipeline: both `corner-pin-active` and `webgl-warp-active` were true, the WebGL canvas supplied the frame being reprojected, and the fixed-order limitation warning remained visible. Toggle, flower/car isolation, restoration, and removal passed; removing Corner Pin preserved Spherize.
- Premiere differences are shown on the card: processing is capped at 480 px wide and does not model on-screen dragging, keyframes, motion blur, or Adobe's subpixel edge controls.
- **Non-Additive Dissolve was demoted back to reference-only.** Adobe documents its appearance but not an exact public formula; the earlier outgoing-only luma threshold is effectively a luma wipe and does not establish the relative two-clip luminance behavior discussed in non-additive dissolve literature. Its Effects entry is disabled and the direct transition dropdown option is removed. The previous implementation section below is superseded by this correction.
- Final catalog remains **146 interactive / 127 reference-only / 273 total** because Corner Pin was promoted while Non-Additive Dissolve was demoted. `SELFTEST_PASS`; browser warning/error logs were empty.

## 2026-11-05 luminance dissolve and split-layer transition batch

- **Non-Additive Dissolve** now compares the outgoing real frame's Rec.709 luma against a progress threshold and replaces qualifying pixels with the incoming real frame. Processing is deliberately capped at 640x360 for real-time browser performance and scaled to the Program monitor. At progress 0.149, the canvas reported a 15% luma threshold, both videos were `readyState=4`, and only the transition canvas was visible. Completion hid the canvas, selected the destination clip, restored opacity 1, and enabled the scrubber. Premiere's precise threshold curve, bit-depth/color-management behavior, and edge interpolation are not claimed.
- **Center Split** now uses two live canvas copies of the outgoing real frame, clipped to left/right halves and translated in opposite directions while the incoming real video plays underneath. At progress 0.152, transforms were -73.30/+73.30 px, both half layers were visible, and both videos were ready. This is distinct from the existing Split transition, which reveals the incoming clip from its center without moving two outgoing halves. Completion hid both canvases and restored the normal monitor.
- Transition workflow passed: Center Split completed, Film Dissolve replaced it, and the timeline remove button cleared the name and hid the marker. Playback target selection and scrubber restoration passed in both directions. Browser warning/error logs remained empty.
- **Corner Pin remains reference-only.** Four independent corner coordinates require inverse projective homography texture sampling with correct alpha/out-of-bounds behavior. `clip-path` only crops and CSS perspective does not expose four independent destination corners, so either would misteach the effect. A dedicated WebGL homography pass and combination policy with the existing single-warp pipeline are required before promotion.
- Catalog count after this batch: **146 interactive / 127 reference-only / 273 total**.

## 2026-11-05 Color Emboss and Film Dissolve batch

- Promoted **Color Emboss** only after replacing the former misleading placeholder with a real directional 3x3 RGB convolution over the actual video. Relief 0 is neutral and removes the filter; Relief 8 applies `kernelUnitLength=4`. The UI explicitly states that Premiere direction, contrast, blend, and exact kernel calibration are not modeled.
- Color Emboss + Camera Blur composition passed: the rendered chain contained both `url(#cameraBlurFilter)` and `url(#colorEmbossFilter)`. The car clip remained neutral with no cards; returning to flower restored both. Removing Color Emboss preserved Camera Blur and removed only the emboss filter.
- Promoted **Film Dissolve** as an explicit optical-density-style approximation rather than the prior unverified contrast flicker. At progress 0.144, both real videos were `readyState=4`; outgoing/incoming nonlinear density values were `0.894/0.248`, visibly distinct from linear Cross Dissolve. Completion selected the car, restored opacity to 1, cleared inline transition styles, enabled the scrubber, and retained the named transition marker. Exact Premiere film-stock response and color science are not claimed.
- Browser warning/error logs were empty. Catalog count after this batch is **144 interactive / 129 reference-only / 273 total**.
- Deliberately retained as reference-only: Non-Additive Dissolve needs a verified luminance-driven per-pixel selection path; Center Split needs separately movable outgoing left/right halves; Corner Pin needs a projective texture warp; DeNoise/DeReverb need validated models or algorithms; Loudness Meter needs BS.1770/EBU R128; Morph Cut, Warp Stabilizer, Auto Reframe, and Rolling Shutter Repair require temporal analysis/tracking. Film Impact and VR entries remain reference-only without their plugin/360-specific processing.

## 2026-11-05 Loudness Meter accuracy rejection

- Audited the reference-only **Loudness Meter** before promotion. A candidate short-window RMS/sample-peak analyser was deliberately rejected and removed: it did not implement Premiere-style K-weighting, momentary/short-term/integrated LUFS, gating, or true peak, so it would teach a materially different measurement under the same name.
- The bundled clean VoiceBank WAV measured directly from its 16-bit PCM at **-20.88 dBFS RMS / -6.02 dBFS sample peak**. The browser real-time analysis path in the automated session reported roughly **-80 / -64 dBFS** in the speech region, so the live values also failed the independent PCM cross-check. No unreliable meter UI or interactive count was retained.
- `Loudness Meter` remains reference-only. A trustworthy implementation requires a verified BS.1770/EBU R128 measurement path (K-weighting, channel weighting, absolute/relative gating, 400 ms and 3 s windows, integrated accumulation, and true-peak oversampling) plus browser PCM fixtures. The existing audio Volume/Mute/EQ/dynamics effects remain the appropriate interactive signal controls.
- Catalog count therefore remains **142 interactive / 131 reference-only / 273 total**. No install, upload, push, or deployment was performed.

## 2026-11-05 reference backlog classification and three-effect batch

- Backlog classification used before implementation:
  - Feasible from current real media and browser primitives: selected standard masks/transitions, Generate overlays, simple spatial transforms, and deterministic signal filters.
  - Feasible with specific additional inputs: measured room impulse files, paired clean/noisy/reverberant speech, 360/equirectangular footage, suitable alpha/matte clips, or plugin-authored presets.
  - Not appropriate to approximate with the current evidence: Warp Stabilizer, Auto Reframe, Morph Cut, advanced Film Impact/VR effects, Pitch Shifter, Ambisonics, and ML/tracking effects. These stay reference-only rather than receiving same-name substitutes.
- **Lightning**: a deterministic branched SVG generator is screen-blended over the actual MP4. Intensity 0 rendered overlay opacity 0; 100 rendered opacity 1 with the lightning SVG present. Toggle off, flower/car isolation, restoration, and removal passed. The UI states that Premiere endpoint, conductivity, turbulence, evolution, color, and multi-segment controls are not modeled.
- **Spiral Boxes**: a 10x6 block mask follows a true outside-in spiral ordering. At progress 0.484 exactly 29 of 60 cells were revealed and both videos were `readyState=4`. It is structurally distinct from Zig-Zag, CheckerBoard, and Random Blocks.
- **Paint Splatter**: 18 deterministic SVG circles have separate positions, maximum radii, and start thresholds. At progress 0.480, nine splats were active over both ready videos. It is a growing irregular radial mask rather than a renamed block transition.
- Transition replacement and deletion passed: Paint Splatter replaced Spiral Boxes, then removal hid and cleared the timeline marker. Two previews returned to flower and re-enabled the scrubber.
- Video combination regression passed: Lightning + Camera Blur simultaneously produced overlay opacity 0.72 and the circular camera-blur filter. Removing Lightning preserved Camera Blur and returned overlay opacity to 0.
- Current DOM catalog count: **142 interactive / 131 reference-only / 273 total**. Automated self-test passed; browser warning/error logs were empty.

## 2026-11-05 Convolution Reverb implementation

- Promoted **Convolution Reverb** from reference-only only after adding a dedicated `ConvolverNode` path. Its deterministic stereo synthetic room IR contains three explicit early reflections (27, 61, and 109 ms), a 5x5-style decaying noise tail generated at the active context sample rate, and a one-pole IR damping cutoff. Independent controls expose IR Decay, High-Frequency Damping, and Wet Mix. Premiere measured-IR loading, pre-delay, width, EQ, and gain are not modeled and the card states this limitation.
- Offline PCM impulse test passed. With 1.8 s decay, 4200 Hz damping, and 38% wet, rendered energy decreased from **0.068778** in the 20-130 ms early window to **0.053123** at 350-550 ms and **0.004942** at 1.25-1.55 s. Convolver-normalized samples at the explicit reflection times were nonzero (`0.007898`, `-0.002995`, `0.004073`). The IR contained 86,400 samples at 48 kHz.
- UI/default graph reported `1.8 / 4200 / 0.38 / 86400`; changed controls reported `3 / 900 / 0.7 / 144000`. Bypass set wet to 0, car had no effect card and wet 0, returning to flower restored `3 / 900 / 0.7`, and removal returned wet to 0.
- Composite routing with Lowpass and Channel Volume reported convolution `1.8/4200/0.38/86400`, low-pass 4000 Hz, and stereo levels `0.7/1.2`. Removing only Convolution Reverb preserved both other effects and set convolution wet to 0.
- Current DOM catalog count: **139 interactive / 134 reference-only / 273 total**. Automated self-test passed; browser warning/error logs were empty. Subjective listening and equivalence to Adobe's factory IR presets remain not run/not claimed.

## 2026-11-05 four-effect implementation follow-up

- **Band Slide**: six SVG mask bands reveal the incoming real MP4 from alternating left/right directions. At progress 0.484 the mask contained six rectangles; both videos were `readyState=4`. Completion selected the car clip and re-enabled the timeline scrubber. It is distinct from the single-edge Wipe.
- **Camera Blur**: restored from reference-only only after replacing the former Gaussian-style duplicate with a real 5x5 circular `feConvolveMatrix` kernel. Radius 0 removes the filter entirely; radius 20 sets `kernelUnitLength=5` and materially changes the captured frame (JPEG evidence 33,941 vs 17,853 bytes). Toggle off, effect removal, car neutrality, and flower restoration passed. This remains approximate: Premiere iris/blade curvature, highlights, focal distance, and depth-map controls are not modeled.
- **Page Peel**: a diagonal corner-reveal mask is combined with perspective Y rotation, slight Z rotation, and a moving drop shadow. At progress 0.484, the incoming clip-path was `polygon(51.555% 0,100% 0,100% 100%,34.5992% 100%)`, outgoing rotation was -37.79 degrees, and both videos were ready. Completion cleared transform/filter, selected car, and re-enabled the scrubber. It remains a flat-plane approximation rather than Premiere's full curved-page shading.
- **Zig-Zag Blocks**: a 10x6 SVG block mask follows alternating left-to-right/right-to-left row order. At progress 0.484 exactly 29 of 60 blocks were visible, matching the expected sequential threshold; both videos were ready. Completion selected car and restored the timeline controls. It is distinct from deterministic diagonal CheckerBoard and pseudo-random Random Blocks.
- Current DOM catalog count: **138 interactive / 135 reference-only / 273 total**. All four names resolve to enabled controls. Automated self-test passed and browser warning/error logs were empty.
- Capture upload was explicitly cancelled. No Library upload was attempted after cancellation, and no local capture path is published with this site.

## 2026-11-05 1280x720 visual capture and Band Slide

- Captured the real default Editing-style workspace at exactly 1280x720. Document dimensions were 1280x720 with no page-level overflow. Measured panel rectangles stayed within the viewport: Effect Controls 496x376, Program 483x376, Properties 293x376, Effects 496x296, and Timeline 780x296. Long Effect Controls content uses its own scrollbar rather than overlapping adjacent panels. The flower MP4 was visible at `readyState=4`.
- Captured a representative Spherize + Color Balance composite on the real flower MP4. Both WebGL and Color Balance canvases were active, Color Balance reported `source=webgl`, and the fixed-pipeline limitation notice was visible in Effect Controls. Document dimensions remained 1280x720 with no page-level overflow.
- Captured the applied Wipe state after preview. The timeline showed the named rectangular transition block at the clip boundary, both videos reported `readyState=4`, the car clip became active, and the scrubber was enabled after completion.
- Added **Band Slide** as one new interactive approximate transition. Six SVG mask bands reveal the incoming real MP4 from alternating left/right directions; it is not a renamed Wipe. At progress 0.484 the mask contained exactly six band rectangles, both videos were ready, and the captured frame showed alternating flower/car bands. Completion selected the car clip, retained the Band Slide marker, exited transition state, and re-enabled the scrubber.
- That capture-time audit reported **135 interactive entries / 138 reference-only / 273 total** immediately after Band Slide. The later four-effect follow-up above supersedes it at 138 / 135 after Camera Blur, Page Peel, and Zig-Zag Blocks were implemented. DeNoise/DeReverb, Pitch Shifter, advanced Film Impact, VR, ML/tracking, and depth-dependent effects remain reference-only rather than receiving misleading substitutes.

## 2026-11-05 multi-effect workflow and state-isolation audit

- Scope: a separate 1280x720 browser session reproduced the student flow: search, apply, numeric entry, fx toggle, delete, clip selection, playback, transition apply/replace/delete, and audio graph initialization. The viewport stayed exactly 1280x720 with no document-level horizontal or vertical overflow; both source MP4s reported `readyState=4`.
- Ordinary video stacking passed: Gaussian Blur + Lumetri Color + Crop produced `brightness(1.08) contrast(1.25) saturate(1.65) blur(12px)` and `clip-path: inset(8%)`. Turning Lumetri off retained Blur and Crop; turning it back on and deleting Blur retained Lumetri and Crop while Blur returned to 0. Numeric Brightness entry of 140 updated the rendered filter to `brightness(1.4)`.
- Clip isolation passed: the flower clip retained Lumetri 140% + Crop while the car clip opened with no effects and neutral filter/clip-path. Returning to flower restored both controls and rendered values. Hard Limiter and Channel Volume likewise reported active values on flower, neutral values on car, and restored values after returning.
- Transition lifecycle passed: Wipe applied and completed with both controls re-enabled; CheckerBoard then replaced it and revealed all 60 grid cells; remove hid the timeline transition marker and restored the generic apply/preview label. The flower effects remained intact after the two previews switched clips twice.
- Defect fixed — pixel pipeline overwrite: Ultra Key and Color Balance previously reread the raw `<video>`, so a preceding WebGL distortion could be hidden. The CPU stages now consume the prior rendered frame in a fixed teaching pipeline: WebGL transform/color -> Ultra Key -> Color Balance. Browser evidence for Spherize + Ultra Key + Color Balance reported `ultra source=webgl`, `color source=ultra-key`, 36,608 transparent pixels, and all three canvases active. Disabling Spherize changed the key source to `video`; disabling Ultra Key changed Color Balance source to `webgl`; removing Spherize preserved both remaining effects.
- Limitation made visible: when two or more fixed-pipeline pixel effects are active, Effect Controls states that the web pipeline uses a fixed processing order and does not reproduce arbitrary Premiere effect-stack order.
- Defect fixed — parallel dynamics summing: DeEsser, Dynamics, Multiband Compressor, Dynamics Processing, Scientific Filter, and Hard Limiter use separate educational Web Audio branches. They are now mutually exclusive instead of silently summing parallel outputs. Adding Hard Limiter disabled DeEsser; re-enabling DeEsser disabled Hard Limiter. Channel Volume and Lowpass stayed enabled and the initialized graph reported DeEsser `6200/-30/8/1/1`, Hard Limiter inactive `0/1/0`, Channel Volume `0.7/1.2`, and Lowpass 4000 Hz. The UI explicitly explains this one-branch limitation.
- Exclusive-branch UI follow-up: fx toggles now expose `aria-pressed`, the Effects catalog highlights only the branch that is actually enabled, and clicking a catalog entry whose retained control is off re-enables it while turning the previous branch off. Thus retained settings remain available without presenting two branches as simultaneously processed.
- Composite PCM test passed for a real serial chain of 4 kHz low-pass -> independent channel gains (L 70%, R 120%) -> -6 dBFS sample limiter. At 1 kHz the combined left peak was exactly **0.501187**; bypassing only the limiter raised it to **0.651388**. The right path stayed below the ceiling at peak 0.372222. At 10 kHz the low-pass reduced left RMS from 0.101398 to **0.012908** and right RMS from 0.173825 to **0.022128**. This verifies simultaneous filtering, stereo level adjustment, and limiting from rendered PCM rather than UI values alone.
- Composite delete/clip follow-up: with Hard Limiter + Channel Volume + Lowpass, removing only Hard Limiter returned its branch to `0/1/0` while preserving Channel Volume `0.7/1.2` and Lowpass 4000 Hz. The car clip remained neutral (`1/1`, 20000 Hz, zero effects), and returning to flower restored the remaining effects while the previously disabled DeEsser remained visibly off.
- Status: **passed** for tested ordinary stacking, toggle/delete isolation, clip isolation, transition lifecycle, fixed pixel pipeline, and exclusive dynamics routing. **Not claimed**: arbitrary Premiere stack-order equivalence, simultaneous use of multiple educational dynamics branches, subjective audio listening, or all 131 approximation pairs.

## 2026-11-05 core effect audit / Hard Limiter repair

- Catalog count remains **131 browser approximations / 142 reference-only / 273 total**. This audit corrected a misleading existing implementation rather than increasing the count.
- Initial PCM audit found a real Hard Limiter defect: the prior high-ratio `DynamicsCompressorNode` increased a quiet 0.1-amplitude sine to 1.482x RMS and reduced a loud 0.9-amplitude sine only to 0.860x. It did not enforce the advertised -6 dBFS ceiling, so that path was rejected.
- Hard Limiter repair: the effect now uses its own 4096-point `WaveShaperNode` that clamps sample peaks at an adjustable dBFS ceiling. At -6 dBFS, the calculated limit is 0.501187. Offline rendered PCM measured the quiet signal at RMS 0.070711 / peak 0.100000 (unchanged) and the loud signal at RMS 0.435229 / peak **0.501187** (at the requested ceiling). The replacement PCM test passed.
- Hard Limiter UI/state: default reported `-6 / 0.501187 / active`; the -18 dBFS extreme reported `-18 / 0.125893 / active`. Switching to car returned `0 / 1 / inactive`, switching back restored -18 dBFS, and removal restored the inactive neutral state.
- Single-band Compressor PCM audit: the Web Audio compressor reduced the loud 0.5-amplitude sine to 0.749x RMS, but increased the quiet 0.02-amplitude sine to 3.467x because the browser node applies automatic makeup behavior that is not exposed as an independent control. The effect still performs level-dependent compression and remains explicitly approximate, but this auto-makeup difference from Premiere is now a documented limitation. UI default `-24/20/4/12/250`, extreme `-60/20/20/12/250`, and removal `0/0/1/0/250` were verified.
- Channel Volume PCM audit passed exactly: independent stereo input rendered with left 70% and right 120% produced measured ratios **0.700000** and **1.200000**. This confirms the prior global-gain defect remains fixed and the two channels are independently scaled.
- Frequent video-effect audit: Gaussian Blur 12 px plus Crop 8% produced computed `blur(12px)` and `clip-path: inset(8%)` on the real flower MP4 at `readyState=4`. Removing Blur retained Crop and returned blur to 0; switching to car returned both filter and clip-path to neutral. No no-op behavior was found in these two high-use paths.
- Regression: program playback advanced to 7.9236 s at `readyState=4`; CheckerBoard preview showed both real MP4s at `readyState=4`, progress 0.450, and 26 revealed cells. No browser warning/error logs were reported.
- Test-status distinction: the original combined core-audio audit is intentionally recorded as **failed** because it exposed the obsolete compressor-based Hard Limiter. The replacement `hardlimitertest` passed and is the authoritative test for the current implementation. Subjective listening and true-peak/intersample limiting remain **not run/not claimed**; the new limiter is a sample-peak teaching approximation.

## 2026-11-05 Delay / Analog Delay signal-path repair

- Catalog count remains **131 browser approximations / 142 reference-only / 273 total**. Delay and Analog Delay were already counted as available, but an audit found their former presets did not set a wet mix, so the named effect could produce no audible delayed output. This batch repairs the behavior rather than inflating the implemented count.
- Delay: the standard feedback `DelayNode` preset now exposes 220 ms delay, 32% feedback, and 42% wet mix. Browser verification reported exactly `220 / 32 / 42`; effect removal returned `0 / 0 / 0`. It is now a real repeated echo rather than a parameter-only card.
- Analog Delay: a separate 1-second `DelayNode` has its own feedback loop containing a real low-pass `BiquadFilterNode`, so successive repeats darken. Default teaching values are 320 ms / 48% feedback / 2800 Hz feedback tone / 45% wet. The extreme browser test reported `0.7 s / 0.8 / 900 Hz / 0.9`; switching to car disabled the branch (`0.02 / 0 / 2800 / 0`), returning to flower restored the extreme values, and removal restored the disabled state.
- Analog Delay PCM test: a browser `OfflineAudioContext` rendered an impulse through the 320 ms, 48% feedback, 2800 Hz low-pass, 45% wet topology. Measured echo-window energies were **0.4500 at 0.32 s**, **0.09546 at 0.64 s**, and **0.04806 at 0.96 s**. The automated test passed: three time-separated echoes existed and decayed successively. This is rendered PCM evidence, not node inspection.
- Regression: program playback advanced to 15.9749 s with real MP4 `readyState=4`; Random Blocks preview showed both MP4s at `readyState=4`, progress 0.448, and 25 revealed cells. No browser warning/error logs were reported.
- Approximation limits: Premiere Analog Delay saturation, wow/flutter, stereo spread, tempo sync, and exact feedback coloration are not modeled. Subjective listening is not claimed. The measured impulse test establishes delay spacing, feedback decay, and filtered-loop activity, while the VoiceBank sample confirms the live path initializes and accepts control changes.
- Priority review for next work: (1) measurable high-value audio: a calibrated Hard Limiter/Single-band Compressor PCM level test and Channel Volume stereo test; (2) video: a distinct Camera Blur would require aperture/bokeh sampling rather than reusing Gaussian Blur; (3) Cineon Converter/SDR Conform require documented transfer functions and appropriate log/HDR sources; (4) Auto Reframe, Warp Stabilizer, Rolling Shutter Repair, Morph Cut, DeNoise, and DeReverb require tracking, optical flow, spectral estimation, or ML and should remain reference-only without those inputs.

## 2026-11-05 audio PCM measurement / Dynamics Processing batch

- Catalog: **131 browser approximations / 142 reference-only / 273 total**. Dynamics Processing was enabled with a static input/output transfer curve; DeEsser received an independent offline PCM selectivity test.
- DeEsser PCM test: a browser `OfflineAudioContext` rendered equal-amplitude 1 kHz and 10 kHz sine inputs both dry and through the same 6.2 kHz split-band / -30 dB / 8:1 topology used by the teaching effect. Dry RMS was 0.353553 for both tones. Processed RMS was 0.313728 at 1 kHz and 0.095962 at 10 kHz, producing ratios **0.887** and **0.271** respectively. The automated test passed because the high band was reduced materially more than the low band. This is measured PCM output, not node-topology inference.
- Dynamics Processing: a 4096-point oversampled `WaveShaperNode` implements a static dB-domain transfer curve with independent slopes below and above an adjustable threshold. Default UI/graph state was `-24 dB / 1.15 / 0.45 / active`; the extreme test was `-40 dB / 2 / 0.1 / active`. Switching to car disabled the processing gain (`-24 / 1 / 1 / 0`), returning to flower restored the extreme values, and effect removal restored the neutral disabled state.
- Dynamics Processing PCM test: a browser offline render compared quiet amplitude 0.02 and loud amplitude 0.5 sine inputs. Quiet dry/wet RMS was 0.014142 / 0.011581 (ratio **0.819**); loud dry/wet RMS was 0.353553 / 0.129543 (ratio **0.366**). The measured output confirms the configured curve changes loud signals more strongly than quiet signals rather than acting as a renamed fixed gain.
- Regression: the decoded clean VoiceBank WAV was `readyState=4` with its processing graph active. Program playback advanced to 14.2701 s with real MP4 `readyState=4`; CheckerBoard preview showed both MP4s at `readyState=4`, progress 0.490, and 28 revealed cells. The independent PCM tabs and interaction tab reported no browser warning/error logs.
- Verification boundary: these tests establish actual rendered PCM/RMS behavior and frequency selectivity. Subjective listening, Adobe curve calibration, detector ballistics, loudness matching, and perceptual quality are **not claimed**. Existing Multitap, Phaser, and Graphic EQ already retain their separate impulse/frequency-response test paths; DeNoise/DeReverb remain unsupported rather than being relabeled EQ/reverb presets.

## 2026-11-05 split-band DeEsser batch

- Catalog: **130 browser approximations / 143 reference-only / 273 total**. DeEsser was enabled with a dedicated split-band signal path; it is not a renamed EQ, DeHummer, or full-band compressor.
- Signal path: the decoded VoiceBank noisy speech is split at an adjustable crossover into a low-pass branch and a high-pass sibilance branch. The low branch is preserved, while only the high branch passes through its own `DynamicsCompressorNode`; both branches are recombined at the output. The normal dry route is muted only while DeEsser is active.
- Default verification: the real noisy WAV was decoded at `readyState=4`, its processed graph was active, and playback advanced to 0.7807 s. The graph reported `6200 Hz / -30 dB / 8:1 / low gain 1 / high gain 1`, matching the three visible controls.
- Extreme/isolation/removal: changing frequency, threshold, and ratio produced `10000 Hz / -55 dB / 20:1 / 1 / 1`. Switching from flower to car disabled both DeEsser branch gains (`6200 / 0 / 1 / 0 / 0`); returning to flower restored the extreme values. Removing the effect returned both branch gains to zero and left the initialized sample graph healthy.
- Regression: timeline seek and Space playback kept the program MP4 at `readyState=4`; Random Blocks preview then showed both real MP4s at `readyState=4`, progress 0.518, and 32 revealed grid cells. No browser warning/error logs were reported.
- Approximation limits: Premiere detector audition, broadband mode, gain-reduction metering, filter-slope calibration, look-ahead, and channel-link controls are not modeled. Automated topology and node-parameter verification passed, but subjective listening and Adobe-identical reduction amount are **not claimed**. The noisy VoiceBank file is useful for signal routing but was not created as a calibrated isolated-sibilance test.
- Remaining audio candidates: Dynamics Processing requires an editable transfer curve rather than reusing the compressor; a more complete DeEsser would benefit from an isolated spoken-sibilance sample plus measurable before/after band energy; DeNoise and DeReverb still require spectral/noise-profile or dereverberation processing and remain reference-only.

## 2026-11-05 Random Blocks / CheckerBoard transition batch

- Catalog: **129 browser approximations / 144 reference-only / 273 total**. Random Blocks and CheckerBoard were enabled only after implementing distinct full-frame procedural mattes.
- Random Blocks: a deterministic 10x6 grid assigns each cell a pseudo-random reveal threshold, so unrelated rectangular areas of the incoming real clip appear across the entire frame. At progress 0.602, 38 of 60 blocks were visible and both MP4s were `readyState=4`. It is distinct from Block Dissolve: Block Dissolve is a single-clip effect that removes source blocks, while Random Blocks is a two-clip transition that reveals the incoming clip.
- CheckerBoard: the same 10x6 geometry uses checker parity plus diagonal position to schedule cells in two ordered phases. At progress 0.579, 35 of 60 cells were visible. The captured middle frame visibly alternated flower and car imagery across the full checker grid. It is distinct from Checker Wipe, which remains a moving jagged boundary rather than a full-frame cell schedule.
- Separation audit: after CheckerBoard completed, its inline and computed `mask-image` both returned to none. A subsequent Checker Wipe at progress 0.602 had `mask-image: none` and the expected staggered boundary `clip-path` (about 60.2% / 66.2% alternating edges). This also found and fixed a timer-order defect where the final grid tick could restore a full mask after cleanup; the grid timer now stops before the shared transition cleanup.
- Lifecycle: Random Blocks completed on the car clip, CheckerBoard returned to flower, and selecting Random Blocks again replaced the timeline transition label. Clicking the marker delete button cleared the label, hid the marker, and left no mask. Timeline seek to 32% followed by Space advanced playback to 13.2215 s with `readyState=4`; a second Space paused. No browser warning/error logs were reported.
- Approximation limits: Premiere's exact random seed, block-size controls, checker origin/direction, border color/width, antialiasing, and GPU timing are not modeled. The implementation teaches the correct two-clip matte principle and visible pattern distinction, not Adobe-identical rendering.
- Other reviewed items remain reference-only: Paint Splatter requires an authored or procedural splatter matte with controlled evolution; Spiral Boxes and Zig-Zag Blocks need distinct geometric sequencing; Film Impact transitions require proprietary algorithms/assets. They were not mapped to the new grid effects merely to increase the count.

## 2026-11-05 three-way Color Balance batch

- Catalog: **127 browser approximations / 146 reference-only / 273 total**. Color Balance was restored only after replacing the rejected global hue/brightness preset with an independent per-pixel tonal-range implementation.
- Processing: a CPU canvas computes source luminance for every real-video pixel, derives separate shadow, midtone, and highlight weights, then applies independent red/green/blue adjustments for each range. Nine visible controls correspond to those three ranges. The teaching implementation does not claim Premiere's exact tonal boundaries or Preserve Luminosity calibration.
- Default verification: the flower MP4 produced a visible 640x360 processed canvas with settings `-12/0/18 / 8/0/-5 / 14/4/-10`; the source video was hidden only while the processed canvas was active. The screen showed a restrained cool-shadow/warm-highlight grade rather than the former whole-frame hue rotation.
- Neutral/extreme/removal: setting all nine controls to zero produced the recorded neutral state `0/0/0/0/0/0/0/0/0`. The extreme test independently set Shadow Blue and Highlight Red to 100, yielding `0/0/100/0/0/0/100/0/0`. Switching to car hid the color-balance canvas and restored the original program video; returning to flower restored the extreme settings. Removing the effect hid the canvas and restored source visibility.
- Effect combination: on the MDN chroma sample, Ultra Key remained active with 36,836 transparent pixels while Color Balance consumed its processed canvas as input. The underlying Ultra canvas was hidden from display, the Color Balance result remained visible, and the actual car background stayed active. This verifies ordered keying-then-grade composition instead of two canvases simply covering one another.
- Regression: after returning to the real flower clip, timeline seek and Space playback advanced to 16.8389 s with `readyState=4`. Wipe preview then showed both real videos at `readyState=4`, progress 0.490, and incoming clip-path near 51.0%. No browser warning/error logs were reported.
- Standard transitions reviewed but not promoted: Film Dissolve and Non-Additive Dissolve remain reference-only because the existing experimental paths are not materially distinct enough from a generic opacity dissolve; Page Peel remains reference-only because the current Page Turn approximation lacks a true peel/curl matte; Morph Cut requires optical-flow/face-aware interpolation. Likely next implementable items are procedural Random Blocks or CheckerBoard wipes, but each needs a visibly distinct generated matte and timing audit before activation.
- Other likely next color items: Cineon Converter and SDR Conform are technically possible as explicit log/tone-mapping curves, but require documented transfer/range assumptions to avoid teaching an arbitrary contrast curve. They remain reference-only pending that calibration.

## 2026-11-05 Track Matte Key / Ultra Key batch

- Catalog: **126 browser approximations / 147 reference-only / 273 total**. Track Matte Key and Ultra Key were enabled only after receiving distinct matte and spill-processing paths; they are not aliases of Color Key.
- Track Matte Key: applies a generated black-and-white elliptical luma-style matte to the actual flower MP4. Default output used a `58% x 72%` radial matte centered at `50% / 50%` with `6%` feather. Invert changed the mask from opaque-center/transparent-edge to transparent-center/opaque-edge. Switching to the car clip returned `mask-image: none`; switching back restored the inverted matte; effect removal returned `mask-image: none` and removed the effect class. Unlike Premiere, this teaching version uses an adjustable built-in matte instead of referencing another timeline video track, and it does not claim track motion or arbitrary matte footage.
- Ultra Key: a dedicated CPU canvas processes the real MDN CC0 chroma MP4 at its native 320x192 sample resolution. It uses hue distance plus minimum saturation/luma, edge softness, Matte Choke, and a separate spill-suppression pass. The tuned sample defaults (`Key Hue 65`, tolerance 10, minimum saturation 55, softness 4) preserved the face/hair/dark shirt while compositing the car footage behind the subject; 36,836 pixels had alpha below 32 in the verified frame. The earlier broad tolerance visibly damaged the face and was rejected before the defaults were committed.
- Ultra Key controls are materially distinct: changing Spill Suppression from 0 to 100 left the alpha count unchanged, as expected for a color-only despill pass; changing Matte Choke to 30 reduced the removed area to zero in this sample, demonstrating that the control modifies the matte rather than color. The extreme is intentionally educational and not a recommended setting. Effect removal hid the processing canvas, restored the source video visibility, and left no dynamic effect card.
- Ultra Key limitations: Premiere output modes, pedestal/transparency, shadow/highlight cleanup, color correction, GPU acceleration, and eyedropper sampling are not modeled. The canvas is capped at 640 px wide for other media to bound CPU/readback cost. The verified sample visually showed a coherent subject and background composite, but Adobe-identical edge reconstruction is not claimed.
- Regression: after deleting Ultra Key, selected the real flower timeline clip, sought to 28%, and pressed Space; playback advanced to 11.6134 s with `readyState=4` and the Ultra canvas hidden. Wipe preview showed both real videos at `readyState=4`, progress 0.467, and an incoming clip-path near 53.3%. No browser warning/error logs were reported.

## 2026-11-05 Tint / Channel Volume accuracy batch

- Catalog: **124 browser approximations / 149 reference-only / 273 total**. Tint was restored from reference-only only after replacing the misleading global hue/saturation preset with a luminance-mapping implementation. Channel Volume was already counted as available, but its former global-gain behavior was replaced rather than recounted.
- Tint: an SVG `feColorMatrix` now maps source luminance between independent numeric `Map Black` and `Map White` RGB triplets and blends the result with `Amount to Tint`. Default 70% produced a non-identity 4x5 matrix and the real program video used `url("#tintMapFilter")`; 0% produced the exact identity matrix; 100% produced the full luminance-to-color mapping. Switching from flower to car removed the filter, returning to flower restored it, and effect removal removed the SVG filter from computed output. Premiere color pickers are represented by numeric RGB controls, so the UI is approximate while the tonal mapping principle is genuine.
- Channel Volume: the prior preset incorrectly adjusted one global gain. It now exposes independent left/right channel levels and multiplies the actual stereo routing matrix outputs. On the decoded VoiceBank sample, default controls reported real output multipliers `0.7 / 1.2`; the extreme test reported `0 / 2`; removing the effect restored `1 / 1`. The sample graph was initialized (`processed=true`), media decoded at `readyState=4`, and playback advanced to 1.741 s. The VoiceBank speech is not claimed to provide a calibrated stereo-image listening test, and subjective listening is not claimed.
- Regression: selected the car clip, sought the timeline to 62%, and pressed Space while the scrubber retained focus. Playback advanced to 6.7253 s with `readyState=4`; a second Space paused. Wipe preview then showed both real videos at `readyState=4`, marker `Wipe`, progress 0.512, and incoming `clip-path: inset(0 48.7611% 0 0)`. No browser warning/error logs were reported.
- Deferred rather than faked: Track Matte Key still needs a selectable matte layer; Ultra Key needs spill suppression, matte cleanup, and more controls than the existing Color Key teaching sample; DeEsser needs a frequency-selective detector/dynamic gain stage; Dynamics Processing needs an editable transfer curve. These remain reference-only until those distinct signal paths can be implemented and measured.

## 2026-11-05 classroom-flow reliability audit

- Catalog after accuracy review: **123 browser approximations / 150 reference-only / 273 total**. `Color Balance`, `Tint`, `Brush Strokes`, `Color Emboss`, and `Roughen Edges` were demoted to disabled reference-only entries. Their former implementations taught the wrong core operation (respectively global hue/brightness rather than tonal/channel balance, global hue rather than black/white mapping, a stripe overlay, contrast/drop-shadow rather than convolution embossing, and a fixed polygon rather than a fractal/animated alpha edge).
- Browser confirmation of the demotion: searching each of those five English names returned the expected catalog entry and every result was disabled. The names and measured 25.6.4 folder structure remain available for reference.
- Fixed a real control defect: effect number fields previously updated only on `change`, so a typed value could appear inert until focus left the field. Number fields now update on both `input` and `change`. Gaussian Blur typed directly to `12` immediately produced `blur(12px)` on the selected car clip.
- Clip isolation and restoration: with Gaussian Blur 12 on the car clip, switching to flower returned the program video to `blur(0px)` and removed the extra effect control; switching back to car restored `blur(12px)` and its control. Both real MP4s remained available.
- Transport and seek: the timeline scrubber was focused at value 780 and Space still started playback; media advanced to 13.2516 s while focus remained on `timelineScrubber`. A second Space paused. This specifically covers the previously reported focused-scrubber failure; text/search/number fields remain excluded from the global shortcut.
- Effect removal: removing Gaussian Blur left no dynamic effect control and returned the computed program filter to `blur(0px)`.
- Transition lifecycle: before application the timeline transition marker was hidden. Wipe preview showed both decoded videos playing and, at about 0.85 s, the incoming clip used `clip-path: inset(0 39.8889% 0 0)`. It completed at about 1.81 s, matching the 1.8 s teaching transition duration. Applying Slide replaced the timeline label with `Slide`; clicking the marker's own delete button cleared the label and hid the marker. The control-panel remove button is not used as proof because duplicate-ID lookup was ambiguous; the visible timeline block button was explicitly targeted.
- Reload: a deliberate reload returned the selected clip to flower, the scrubber to 0, program media to `readyState=4`, and the timeline transition marker to hidden. The always-visible preview button is not a transition marker; this distinction was checked in the DOM.
- Desktop layout at 1280x720: six Premiere-style panels remained within a 1280 px document with no horizontal overflow (`scrollWidth == clientWidth == 1280`). The program/effect-control row measured 376 px high and the Effects/Timeline row 296 px high.
- Small viewport: **not run in live browser** because the selected in-app browser did not expose a viewport override in this session. Static CSS review shows screens below 700 px intentionally retain a 958 px minimum Premiere workspace and require horizontal scrolling; this is a known limitation and the page should not be presented as a mobile-first interface. No unverified responsive rewrite was made.
- Visual equivalence to Adobe's pixel algorithms and subjective audio listening remain **not claimed**. The audit covers observable DOM/computed output, real media readiness/playback, state isolation, transition timing, reset/removal, and desktop layout.
- Regression checks: `node --check app.js` passed, `git diff --check` passed, and the two independent browser QA tabs reported no warning/error console logs. There is no standalone `selftest.js` file in this checkout, so that command is **not run** for this audit rather than being reported as a pass.

## 2026-11-05 text / scientific-filter / dynamics batch

- Catalog: 128 browser approximations / 145 reference-only / 273 total. Newly enabled: Metadata & Timecode Burn-in, Simple Text, Scientific Filter, Dynamics, and Multiband Compressor.
- Metadata & Timecode Burn-in: overlays the live sequence timecode and selected clip label on the actual MP4. Verified 120% scale / 80% opacity; during playback the overlay and transport both advanced to `00:00:01:01` while media time reached 1.0949 s at `readyState=4`. Premiere metadata-field choice, source timecode, and layout presets are simplified.
- Simple Text: renders a fixed teaching title over the real video with independent scale and opacity. Verified pseudo-element content, 130% transform scale, and opacity 0.75. It does not pretend to provide Premiere's text editing, fonts, alignment, or keyframes.
- Scientific Filter: four real serial low-pass `BiquadFilterNode`s create a steeper cutoff than the separate single Lowpass effect. The playing VoiceBank graph reported `4 / 2800 Hz / wet 1`; full reset reported `4 / 0 / wet 0`.
- Dynamics: a real static WaveShaper noise gate feeds a separate `DynamicsCompressorNode`. The playing VoiceBank graph reported gate `-42 dB`, compressor `-28 dB / 5:1`, and active output. Reset returned gate inactive and compressor neutral `0 dB / 1:1 / wet 0`. Premiere gate timing, expander, limiter, and detector controls are simplified.
- Multiband Compressor: three actual branches (low-pass, high-pass+low-pass mid band, and high-pass) each feed their own compressor and are recombined. Verified crossovers 300 / 3500 Hz and all three band gains active; reset returned all three gains to 0. Per-band Adobe controls and final limiter are not modeled.
- Audio verification used the decoded 48 kHz VoiceBank Clean WAV (`readyState=4`) and live node topology/parameter data. A separate OfflineAudioContext PCM render was attempted through the browser automation evaluation context, but that isolated context did not expose the constructor; subjective listening and offline PCM equality are therefore not claimed for this batch.
- Reset audit found and fixed an unrelated boolean-class edge case: a missing Block Dissolve effect could toggle `block-dissolve-complete` during reset when the optional value was `undefined`. The condition is now explicitly boolean; fresh/full reset leaves monitor class `monitor`, text pseudo-content `none`, and video mask `none`.
- Regression: no browser warning/error logs; JavaScript syntax and diff checks passed.

## 2026-11-05 block / gradient / standard-transition batch

- Catalog: 123 browser approximations / 150 reference-only / 273 total. Newly enabled: Block Dissolve and Gradient Wipe video effects plus Checker Wipe, Random Wipe, and Page Turn video transitions.
- Block Dissolve: generates a deterministic SVG alpha grid over the real MP4 rather than substituting another clip. At 0% all grid cells remain, at 50% the encoded mask shrank from 8,676 to 5,066 characters and visibly removed distributed blocks, and at 100% a fully transparent mask hides the source. Block Size changes the generated grid density. Premiere random seed and exact pattern are simplified.
- Block Dissolve reset: selected-clip full reset removed the effect card and class and returned computed `mask-image` to `none`.
- Gradient Wipe: a radial alpha/luminance-style mask has independent completion and softness. The 45% / 10% test produced a transparent stop at 45% and opaque stop at 55%. Premiere's external gradient-layer source is not modeled, so the entry is explicitly approximate rather than presented as a full matte workflow.
- Checker Wipe: two decoded real MP4s were simultaneously active. At progress 0.205 the incoming clip had a six-row staggered checker edge and the timeline marker read `Checker Wipe`.
- Random Wipe: a deterministic irregular seven-point boundary revealed the incoming car clip. At progress 0.200 the actual clip-path points varied across rows (20/27/16/29/13/25/20%), visibly producing a jagged edge; Premiere seed, softness, and border controls are simplified.
- Page Turn: a perspective Y-axis fold rotates the outgoing clip from its left edge while the incoming clip fades and counter-rotates. At progress 0.201 the outgoing transform was about -18.45 degrees and incoming about +14.39 degrees. This is a flat CSS perspective approximation, not Premiere's full page curl/shading model.
- Transition lifecycle: incoming and outgoing videos were both `readyState=4` with no errors. After completion, `transitioning` was false, transform origin was removed, program media remained ready, and preview/timeline controls were re-enabled.
- Regression: `SELFTEST_PASS`; no browser warning/error logs; JavaScript syntax and diff checks passed. The Random Wipe mid-frame screenshot showed both the outgoing flower and incoming car imagery plus the named timeline transition block.

## 2026-11-05 lighting / gradient / audio spatial-dynamics batch

- Catalog: 118 browser approximations / 155 reference-only / 273 total. Five formerly reference-only names were enabled: Lighting Effects, Ramp, Flanger, Studio Reverb, and Tube-modeled Compressor. No existing preset was recounted.
- Lighting Effects: a movable radial exposure light is screen-blended over the real video. Verified center `20% / 25%`, intensity `80%`, radius `30%`; the computed radial gradient and opacity changed accordingly. At intensity 0 the overlay opacity was exactly 0. Premiere multiple light types, material, bump, and ambient controls remain unmodeled.
- Ramp: a genuine two-color linear gradient overlay has independent angle and mix controls. Verified 90 degrees / 70% mix and a computed 90-degree three-stop gradient; mix 0 produced opacity 0. Premiere start/end points, editable colors, scatter, and blend modes are simplified.
- Flanger: the existing short modulated-delay path now has a distinct real feedback loop rather than being a renamed Chorus/Flanger preset. VoiceBank verification reported `0.7 Hz / 3 ms modulation amplitude / 55% feedback / 60% wet`; the sample graph was active and the WAV was decoded at `readyState=4`. Full reset returned modulation depth, feedback, and wet level to zero.
- Studio Reverb: a real `ConvolverNode` receives a generated exponentially decaying stereo impulse. At 2.2 s / 45% mix the graph reported a 105,600-sample impulse at 48 kHz and wet gain 0.45. Full reset retained the harmless cached impulse but set wet gain to 0, making the branch bypass-equivalent. Adobe room size, damping, early-reflection, and stereo-image calibration are not matched.
- Tube-modeled Compressor: combines the real soft nonlinear WaveShaper path feeding the real dynamics compressor. Verified `-30 dB / 18 dB / 6:1 / 18 ms / 280 ms` and 25% drive in the playing VoiceBank graph. Full reset returned compressor to neutral `0/0/1/0/250` and drive to 0. Adobe tube transfer calibration, stage order, detector, and makeup gain are not matched.
- Clip isolation: switching the Lighting Effects test from flower to car removed the effect class and returned overlay opacity to 0 while car media remained `readyState=4` with no error.
- Playback/performance: Ramp playback advanced to 1.9785 s during the observation with media `readyState=4`. `SELFTEST_PASS`; no browser warning/error logs; static JavaScript and diff checks passed.
- Subjective listening and Adobe-identical rendering/sound are not claimed. The verification covers visible computed output, graph topology/parameters, decoded media state, neutral/reset state, and playback continuity.

## 2026-11-05 media fallback investigation

- The accessibility text `미디어를 재생할 수 없습니다.` is not a visible program-media error. It is fallback text inside the idle secondary `<video id="transitionVideo">`, whose source is intentionally empty until a transition preview starts. The visible screenshot showed the flower program video normally; no fallback text was rendered on screen.
- Main program media: flower MP4 `readyState=4`, `networkState=1`, no `MediaError`, duration 18.5185 s, and decoded dimensions 1920x1080. Playback advanced from 0 to 8.4933 s and then paused normally at 8.5525 s.
- Local HTTP/media delivery: the flower and MDN chroma MP4 endpoints returned HTTP 200 with `video/mp4` and byte-range support. A first diagnostic probe used a stale car filename and received 404; the application itself uses the existing `5057527-hd_1920_1080_25fps.mp4`, not that stale probe URL.
- WebGL regression: Spherize produced a visible 1920x1080 canvas with the real 1920x1080 source at `readyState=4`; no WebGL unsupported warning appeared. Switching to the car timeline clip kept program media at `readyState=4` with no error.
- Chroma regression: the MDN CC0 sample loaded at `readyState=4` with no error and produced a visible 320x192 processing canvas.
- Audio A/B regression: Clean, Noisy, and Reverb VoiceBank WAVs each loaded at `readyState=4`, duration 1.741292 s, with no `MediaError`. Browser warning/error logs were empty in both normal-media and WebGL/keying sessions.
- No code fix was required: the earlier report's phrase "media fallback" referred to accessibility-tree content, not a visible or functional playback failure.

## 2026-11-05 Channel / Transition audit batch

- Catalog: 113 browser approximations / 160 reference-only / 273 total. `Linear Wipe` under Video Effects > Transition is the one newly enabled catalog entry; the existing `Invert` entry was improved without being counted again.
- Linear Wipe: applies a real left-to-right alpha mask to the selected MP4. Browser-computed masks were verified at 0%, 50% with 5% feather, and 100% completion. The 50% case produced a transparent stop at 50% and an opaque stop at 55%.
- Linear Wipe controls: `Transition Completion` is 0-100% and `Wipe Feather` is 0-20%. Premiere's angle, repeat, and complete feather model are not implemented, so the entry remains explicitly labeled as an approximation.
- Linear Wipe state: switching from the flower clip to the car clip removed the class/mask (`mask-image: none`), and returning to the flower restored it. The selected-clip full reset removed the effect card, class, and mask completely. The per-effect reset returns its documented starting demonstration values (45% completion / 3% feather).
- Invert: replaced the previous fixed 100% CSS inversion with an adjustable 0-100% `Invert Amount`. The 50% test produced `invert(0.5)` in the computed video filter; the same class also targets the WebGL and temporal-effect canvases. Premiere channel selection and blend modes remain unmodeled.
- Regression: `SELFTEST_PASS`; no browser warnings/errors; static JavaScript syntax and whitespace checks passed. The accessibility fallback text was subsequently confirmed to belong only to the idle secondary transition video; the actual program video was visibly rendered and playback-tested in the media investigation above.

## 2026-11-05 Keying / Generate audit batch

- Catalog: 112 browser approximations / 161 reference-only / 273 total. Alpha Adjust is newly enabled; 4-Color Gradient was already counted and was upgraded rather than counted again.
- Alpha Adjust: multiplies the composited real-video alpha after the base Opacity control. Verified 0%, 50%, and selected-clip reset back to computed opacity 1.0. Initial testing found CSS alpha was overridden by the base inline opacity; the final path explicitly multiplies both values.
- Alpha Adjust limitations: invert-alpha, mask/channel selection, and Premiere's full controls remain unmodeled. It is labeled as an approximation.
- 4-Color Gradient: the previous fixed decorative overlay now has a 0-100% Gradient Mix control and four distinct corner-color gradients blended over the real video. Verified overlay opacity 0 and 1 plus selected-clip reset to hidden/no effect.
- 4-Color Gradient limitations: four colors and points are fixed; Premiere's per-color/point controls are not modeled.
- Track Matte Key and Ultra Key remain reference-only. A truthful Track Matte demonstration needs a separate matte clip/routing; Ultra Key needs spill suppression, matte cleanup, and tolerance controls beyond the existing Color Key and is not presented as an alias.
- Regression: `SELFTEST_PASS`; no browser warnings/errors; catalog total remained 273.

## 2026-11-05 Graphic EQ 20/30 Bands batch

- Catalog: 111 browser approximations / 162 reference-only / 273 total.
- Graphic Equalizer (20 Bands): 20 independent serial peaking filters on a generic half-octave ISO-style grid from 31.5 Hz to 20 kHz, Q 2.87. All 20 gain controls are separate.
- Graphic Equalizer (30 Bands): 30 independent serial peaking filters on a generic one-third-octave ISO-style grid from 25 Hz to 20 kHz, Q 4.32. All 30 gain controls are separate.
- Adobe 25.6.4 internal center calibration and Q values were not available, so both entries explicitly identify this generic-grid approximation.
- VoiceBank live path: the graph reported 20 and 30 physical nodes. The 20-band test activated only its 1 kHz band at +8 dB; the 30-band test activated only its 1 kHz band at -6 dB.
- Simultaneous application was verified: both banks reported one non-zero band (`20/30/1/1`). Selected-clip reset returned both to zero (`20/30/0/0`).
- Offline 48 kHz impulse response at +6 dB/1 kHz passed. 20-band magnitude was 1.995 at 1 kHz versus 1.038 near 500/2000 Hz; 30-band magnitude was 1.995 at 1 kHz versus 1.017 near 500/2000 Hz. Neutral reference magnitude was 1.0.
- Performance: the 30-band live path advanced 3.181 s during a 3 s observation with all 50 bank nodes present in the common output graph. No browser warnings/errors were recorded.
- Regression: `SELFTEST_PASS`; catalog total remained 273. Subjective listening and Adobe-identical sound were not claimed.

## 2026-11-05 Phaser batch

- Catalog: 109 browser approximations / 164 reference-only / 273 total.
- Phaser is a distinct path from Chorus/Flanger: four serial all-pass `BiquadFilterNode` stages at 400/700/1000/1300 Hz are swept together by an independent oscillator and mixed through a separate wet gain.
- VoiceBank live graph verified while playing: 4 stages, 0.8 Hz LFO, 600 Hz modulation depth, 60% wet.
- Offline 48 kHz impulse-response DFT passed. Magnitudes at 200/500/1000/2000/5000 Hz were 0.251/0.519/0.627/1.099/0.774, a spread of 0.849, confirming the dry+phase-shifted wet path creates frequency-dependent cancellation/reinforcement rather than a delay alias.
- Reset left four dormant stages but returned modulation depth and wet gain to 0; the output path is therefore bypass-equivalent.
- Premiere stage count, feedback, stereo phase, sweep law, and preset calibration are simplified. Subjective listening and Adobe-identical sound were not claimed.
- Graphic Equalizer 20/30 Bands remain reference-only. They require separate 20- and 30-node center-frequency sets and usable controls; neither is presented as a renamed 10-band EQ.
- Regression: `SELFTEST_PASS`; no browser warnings/errors; catalog total remained 273.

## 2026-11-05 Multitap Delay batch

- Catalog: 108 browser approximations / 165 reference-only / 273 total.
- Multitap Delay uses two independent parallel `DelayNode -> GainNode` branches from the compressor output into the final pan/output path. It is not an alias of the existing single feedback Delay.
- VoiceBank path verified while playing: tap 1 `180 ms / 42%`, tap 2 `420 ms / 26%`, dry `75%`; the live graph reported `0.18/0.42/0.42/0.26/0.75` seconds/gains.
- `OfflineAudioContext` impulse test at 48 kHz passed: sample 0 = 0.75, sample 8640 (180 ms) = 0.42, sample 20160 (420 ms) = 0.26. This objectively confirms three time-separated outputs.
- Selected-clip reset removed the effect and returned both wet gains to 0 and dry to 1.0. The dormant delay times normalize to the 20 ms minimum but produce no output while their gains are zero.
- Premiere feedback, per-tap filtering/panning, additional taps, and automation are not modeled; subjective sound quality was not graded.
- Regression: `SELFTEST_PASS`; no browser warnings/errors; catalog total remained 273.

## 2026-11-05 modulation / distortion / parametric-EQ batch

- Catalog: 107 browser approximations / 166 reference-only / 273 total. Only three formerly reference-only names were enabled; existing Channel Volume, Stereo Expander, Delay, compressors, Simple Parametric EQ, and 10-band EQ were not recounted.
- Parametric Equalizer: real low-shelf + adjustable peaking filter + high-shelf chain. Verified `+5 dB / 2200 Hz / Q 1.5 / -7 dB / +4 dB`. Premiere's extra bands and filter shapes remain unmodeled.
- Chorus/Flanger: a separate short `DelayNode` receives a running oscillator through a depth gain and is mixed with the dry path. Verified VoiceBank playback with `1.2 Hz`, `12 ms` requested depth (0.006 s modulation amplitude around an 8 ms center), and 40% wet gain.
- Distortion: real 4x-oversampled `WaveShaperNode` with a nonlinear saturation curve. Verified VoiceBank playback and drive value 60%; Adobe model selection, tone stage, and output compensation are not modeled.
- Bypass/reset behavior: defaults set modulation wet/depth and distortion drive to zero; removing/resetting the effect returns the shared graph to a transparent path. The existing selected-clip state model continues to isolate audio settings by clip.
- Objective verification covered node topology, parameter values, sample playback, catalog state, and browser logs. Offline PCM capture and subjective listening were not completed, so no claim of Adobe-identical sound is made.
- Regression: `SELFTEST_PASS`, no browser warnings/errors, and total catalog size remained 273.

## 2026-11-05 color / limiter / graphic-EQ batch

- Catalog after this batch: 104 browser approximations / 169 reference-only / 273 total. The three newly enabled entries are ASC CDL, Video Limiter, and Graphic Equalizer (10 Bands); no existing entry was counted twice.
- ASC CDL: the real MP4 pixels run through slope/offset/power and then luminance-referenced saturation in the WebGL shader. Verified visible output at `1.4 / 0.05 / 0.7 / 1.5`; controls are linked RGB values rather than Premiere's independent channel controls.
- Video Limiter: the real WebGL output is hard-clamped to the selected RGB ceiling. Verified the visible 50% ceiling result, clip isolation/restore, reset, and 1920x1080 canvas. Gamut standards, chroma limiting, soft knee, and true broadcast legality are not modeled.
- Graphic Equalizer (10 Bands): ten actual serial `BiquadFilterNode` peaking filters at 31/62/125/250/500/1000/2000/4000/8000/16000 Hz, each Q 1.4. Testing found the initially created nodes were not in the signal path; this was corrected by chaining all ten between the parametric EQ and channel splitter.
- EQ verification: both the main program-audio graph and the VoiceBank sample graph reported 10 connected bands. The test setting was `+12 dB` at 31 Hz, `-6 dB` at 1 kHz, and `+9 dB` at 8 kHz, with all other bands at 0 dB. Reset returned every band to 0 and removed the selected effect.
- Combination compatibility: CSS Invert now targets the WebGL and Echo canvases as well as the source video, so it remains visible when combined with pixel effects.
- Playback/performance: Video Limiter playback advanced 3.210 s during a 3 s observation while its WebGL canvas remained active. No browser warnings or errors were recorded.
- Regression: `SELFTEST_PASS`; catalog total remained 273; WebGL reported supported. Clip isolation/restore, selected-clip reset, and empty-search behavior remained intact.
- Listening caveat: audio node topology, filter values, and playback state were verified objectively; this batch was not subjectively listening-graded.

## 2026-11-05 audio implementation batch

- Catalog after temporal-effects restoration: 101 browser approximations / 172 reference-only / 273 total.
- Single-band Compressor: Web Audio `DynamicsCompressorNode`; verified default `-24/20/4/12/250` and changed `-36/10/8/30/500` for threshold/knee/ratio/attack-ms/release-ms.
- Channel Mixer: stereo 2x2 gain matrix; verified identity `100/0/0/100` and channel swap `0/100/100/0`.
- Hard Limiter: high-ratio, zero-knee compressor path; verified `-6/0/20/1/100`. True-peak ceiling and look-ahead are not modeled.
- Stereo Expander: real mid/side-style matrix; verified 150% width. It cannot invent genuine ambience from mono input.
- Vocal Enhancer: verified 80 Hz high-pass, `3500/0.8/+3 dB` presence EQ, and `-20/18/3/10/180` gentle compressor chain. It is an educational recipe, not an Adobe preset match.
- Channel utilities: verified `Fill Left with Right` = `0/0/100/100`, `Fill Right with Left` = `100/100/0/0`, `Swap Channels` = `0/100/100/0`, and audio `Invert` = `-100/0/0/-100`; all processed the playing VoiceBank sample graph.
- VoiceBank A/B: matching clean/noisy/reverb `p232_001.wav`, each mono 48 kHz 16-bit, 1.741292 s, browser load/play error code 0.
- VoiceBank routing: the sample player now creates its own copy of the active Web Audio graph. Hard Limiter, Stereo Expander, and Vocal Enhancer were each verified with `data-processed=true` while a sample was playing.
- `DeNoise` and `DeReverb`: still disabled reference-only items; no EQ substitute was presented as restoration.
- Timeline regression: selected the car clip, sought to 82%, and played at 14.73 s with media error code 0.
- Existing automated self-test: `SELFTEST_PASS` (composition, removal, clip isolation/restore, empty search, two video elements).
- Browser error/warning logs: none.
- Listening caveat: node topology, values, playback, and PCM statistics were verified; subjective listening was not independently graded.

### Accuracy demotions

- Returned 14 visual entries to reference-only because their prior implementation was only whole-frame scale, border radius, drop shadow, or decorative CSS and did not preserve the named algorithm: Camera Blur, Magnify, Lens Distortion, Mosaic, Emboss, Alpha Glow, Lens Flare, Ramp, Brush Strokes, Color Emboss, Roughen Edges, FI: Blur FX, FI: Grow FX, and FI: Shrink FX.
- Returned Film Dissolve and Non-Additive Dissolve to reference-only because the prior contrast wobble/basic opacity fade did not reproduce their compositing behavior.
- Returned Checker Wipe to reference-only because its prior jagged edge was not a checker-tile reveal.
- Wipe mid-frame: progress 0.520; flower and car both playing at about 5.2 s; incoming clip path `inset(0 47.959% 0 0)`.
- Slide mid-frame: progress 0.524; outgoing flower `translateX(-52.405%)`, incoming car `translateX(47.595%)`.
- Spherize: WebGL supported; default `60/50/50/75`, zero amount, reset, per-clip isolation/restore, and removal back to the original video were verified.

### WebGL restoration batch

- Mosaic: source sampling coordinates are quantized into real pixel blocks. Verified block size 1 (neutral), 24 (default), and 80 px (extreme).
- Lens Distortion: center-based radial inverse mapping. Verified curvature 0 (neutral), +45 (default), and -100 (extreme), center 50/50 and radius 100.
- Magnify: local circular inverse mapping rather than whole-frame scale. Verified 100% (neutral), 220% (default), and 400% (extreme), center 50/50 and radius 45.
- Lens Flare: additive procedural core, horizontal streak, and ghost composited on the real MP4. Verified brightness 0, 65, and 100 at center 30/32 and size 18. Source-light tracking and Premiere lens types are not modeled.
- Alpha Glow: restored only for a real alpha-bearing WebGL intermediate. The MDN CC0 chroma sample is keyed first; CSS `drop-shadow()` then follows the transparent canvas boundary. Verified Color Key + Alpha Glow together at radius/intensity `12/70` and `20/100`. Removing Alpha Glow left Color Key active; resetting the chroma clip removed both effects and the WebGL canvas state; selecting the flower clip returned to the untouched source path. Opaque flower/car pixels alone do not produce an alpha edge. This is an educational approximation and does not model Premiere's full color/spread controls.
- Combination: Lens Distortion + Mosaic + Lens Flare ran together on a 1920x1080 WebGL canvas. Playback advanced 3.03 s during a 3 s observation; decoded/dropped-frame counters were unavailable in this browser.
- Timeline isolation: the three-effect combination was absent on the car clip and restored on the flower clip.
- GPU fallback: WebGL-supported path was exercised. The unsupported path deletes the WebGL-dependent presets and shows an explicit warning, but a truly unsupported GPU/browser was not available for runtime reproduction.

### Offset / Replicate WebGL batch

- Offset: real source coordinates wrap after horizontal/vertical shifting. Verified neutral `0/0` and visible wrap at `60/30`; this uses percentage controls instead of Premiere's point UI.
- Replicate: the complete real MP4 frame is tiled by shader coordinate repetition. Verified 1 tile as neutral and 4 tiles per axis as an extreme result.
- Combination: Offset and Replicate were active together on the flower clip; 3.285 s of media advanced during a 3 s observation.
- Clip isolation: neither effect appeared on the car clip, and both returned when the flower clip was reselected.
- Reset: selected-clip reset removed both effects, hid the WebGL canvas, and returned the monitor to its original class state.
- Runtime: no browser warnings or errors were recorded. If WebGL initialization fails, both entries are removed from the working catalog with the existing explicit unsupported warning.

### Mirror / Wave Warp accuracy batch

- Mirror: replaced the former whole-frame CSS flip with a WebGL reflection across a line through an adjustable center and angle. The 50/50, 0° case visibly reflected the left half into the right half. Premiere edge handling remains simplified.
- Wave Warp: replaced the former CSS animation with real sinusoidal sampling displacement of the MP4. Verified height/width/direction/speed/phase controls at `12/22/45/1.2/30`; only the sine mode is modeled, without Premiere wave-shape, pinning, or anti-aliasing options.
- Composition correction: Wave Warp and Mirror now have independent shader enable flags, so applying both performs both pixel operations instead of silently using only the first warp effect.
- Neutral/removal: Wave Height `0` leaves sampling undisplaced. Selected-clip reset removed both effects, hid the WebGL canvas, and restored the original monitor state.
- Timeline/performance: seeking to scrubber `180` reached 7.171 s. The combined effects advanced 3.251 s during a 3 s observation. Car had no effects; both returned on the flower clip.
- Flip/feather audit: Horizontal Flip and Vertical Flip remain valid geometric transforms. Edge Feather remains a rectangular mask approximation. Their CSS now targets the WebGL canvas as well as the original video, verified with Replicate + Horizontal Flip + Edge Feather (`matrix(-1,0,0,1,0,0)` plus the 10% two-axis mask).
- Posterize Time and video Echo remain disabled reference entries. A truthful implementation needs controlled frame-hold cadence and a multi-frame temporal buffer respectively; audio Delay/Analog Delay are separate Web Audio effects and are not treated as video Echo.
- Runtime: no browser warnings or errors were recorded. Mirror and Wave Warp are removed from the working catalog by the existing WebGL unsupported fallback.

### Posterize Time / video Echo temporal batch

- Posterize Time: the WebGL source texture is uploaded only at the selected cadence while timeline time and audio continue normally. At 1 fps, seven monitor samples over 1.545 s produced three visible states (initial frame plus held-frame updates), confirming real frame holding rather than slowed playback.
- Video Echo: stores at most four prior processed frames at 640 px width and composites them through a 960×540 transparent overlay. Four RGBA history frames plus the overlay require about 5.8 MiB, independent of the 1920×1080 source resolution.
- Echo verification: delay/count/decay `120 ms / 4 / 60%` filled exactly four frames; the overlay was visible at 960×540. The implementation snapshots the already processed WebGL canvas, so prior pixel effects precede Echo.
- Seeking and clips: seeking cleared the buffer from four frames to zero and hid the overlay. The car clip had no Echo state; returning to the flower clip restored the effect with a fresh one-frame buffer.
- Combination/performance: Echo + Wave Warp advanced 3.254 s in a 3 s observation while keeping the buffer capped at four frames. No browser warnings or errors were recorded.
- Reset correction: initial testing found the Echo overlay could remain after selected-clip reset because the render loop stopped before clearing it. `apply()` now clears the temporal buffer immediately; retest ended with zero frames, hidden Echo and WebGL canvases, and no effects.
- Distinction: video Echo is listed under Video Effects > Time and is separate from Web Audio Delay/Analog Delay. Premiere echo operators and frame blending modes are simplified.
- Fallback: both temporal effects depend on the WebGL canvas and are removed from the working catalog when WebGL initialization fails.

검증일: 2026-11-05
환경: 로컬 Chrome, `http://127.0.0.1:4187/?selftest=1`

## 통과

- 내장 self-test: `SELFTEST_PASS`
- JavaScript 구문 검사: `node --check app.js`
- 검색: `Gaussian`, `Balance`, `Lowpass` 각각 정확한 작동 항목 표시
- 빈 검색: 존재하지 않는 검색어에서 “검색 결과가 없습니다” 표시
- 숫자 입력: Gaussian Blur 12 → 20, Balance Pan 0 → -100 반영
- 중복 합성: Lumetri Color와 Gaussian Blur가 동시에 유지되고 밝기/대비/채도/블러가 합성됨
- 삭제·잔류: Gaussian Blur 삭제 후 컨트롤과 blur 상태가 모두 제거됨
- 클립별 상태: 자동차 효과 0개와 꽃 Lumetri Color 1개가 독립적으로 보존·복원됨
- 실제 영상 재생과 타임코드 진행
- Dip to Black: 중간 프레임이 완전한 검정이고 완료 후 대상 클립으로 전환됨
- Linear Wipe: 로딩 완료 후 시작하도록 수정했으며 중간 프레임에서 자동차와 꽃의 경계가 화면을 가로질러 이동함
- Cross Dissolve: 두 실제 영상이 겹쳐 전환되고 대상 클립으로 완료됨
- Balance: 재생 중 Pan -100이 Web Audio `StereoPannerNode.pan=-1`에 대응하도록 반영됨
- Lowpass: Cutoff 4000Hz가 Web Audio `BiquadFilterNode.frequency=4000`에 반영됨
- 오디오 전환: Constant Gain, Constant Power, Exponential Fade 모두 두 video 요소의 volume을 40ms 간격으로 변경
  - Constant Gain 중간 관측값: outgoing 0.364 / incoming 0.636
  - Constant Power 중간 관측값: outgoing 0.470 / incoming 0.883
  - Exponential Fade 중간 관측값: outgoing 0.135 / incoming 0.400
- 참고용 효과는 비활성 버튼, “목록 참고” 상태와 도움말로 작동 항목과 분리됨

## 수정 후 재검증

처음 Linear Wipe 캡처에서 대상 영상의 로드가 애니메이션보다 늦어 경계가 보이지 않는 문제가 발견됐습니다. `loadeddata` 후 전환을 시작하고 전환 영상에 `object-fit: cover`를 적용한 뒤 재검증하여 통과했습니다.

## 실패

- 없음

## 제한

- 이 환경은 자동화된 청감 판정 장치가 없으므로 소리의 주관적 품질은 평가하지 않았습니다. 대신 실제 재생 중 Web Audio 노드 값과 두 미디어 요소의 volume 변화가 발생하는 것을 확인했습니다.
- Premiere Pro 2025 공식 목록과 전수 대조하지 않았습니다. 회색 항목은 학습용 참고 목록이며 완전성을 보증하지 않습니다.
- GitHub Pages 배포는 요청에 따라 실행하지 않았습니다.
