# Premiere Effects Lab

Public sample licensing: see [`assets/videos/ATTRIBUTION.md`](assets/videos/ATTRIBUTION.md) and [`assets/audio/ATTRIBUTION.md`](assets/audio/ATTRIBUTION.md). The published media are stock/demo fixtures; no private project files or credentials are included.

Premiere Pro의 Effects 패널, Program Monitor, Effect Controls, Timeline을 웹에서 학습할 수 있도록 만든 정적 실습 페이지입니다. Canvas로 영상을 그리지 않고 HTML `<video>`와 저장소의 MP4 파일을 직접 사용합니다.

## 기준 환경과 배치

- 기준 설치본: Adobe Premiere Pro 2025 `25.6.4`
- 확인된 번들: Film Impact 모듈 93개(`2025.6.1`)
- 학습 배치: Effect Controls 왼쪽 위, Project 왼쪽 아래, Program/Timeline 중앙, Effects 오른쪽

패널 위치는 Premiere의 Editing 작업 영역과 혼동을 줄이기 위한 유사 배치입니다. 사용자의 저장된 작업 영역이나 화면 크기에 따라 실제 Premiere 패널 위치는 달라질 수 있으므로 Adobe의 유일한 고정 기본 배치라고 주장하지 않습니다.

## 미디어

- `assets/videos/9054643-hd_1920_1080_30fps.mp4` — 꽃, 1920×1080, 30fps
- `assets/videos/5057527-hd_1920_1080_25fps.mp4` — 자동차, 1920×1080, 25fps

## 목록과 작동 범위

효과 패널은 영상 효과, 비디오 전환, 오디오 효과, 오디오 전환의 네 종류를 분리해 보여 줍니다.

- 파란 **작동**: 이 페이지에서 실제 적용 또는 미리보기 가능
- 회색 **목록 참고**: 참고용 비활성 항목
- 보라색 글자: 자주 쓰는 효과
- Film Impact: 설치 파일에서 93개를 확인했지만 실제 패널을 열어 분류를 검증하지 못했으므로 `-FX` 파일명 기준 분류라고 명시하고 참고용으로 표시

Adobe 설치 구성과 플러그인에 따라 목록은 달라질 수 있습니다. 이 저장소는 Adobe 공식 전수 목록임을 보증하지 않습니다.

## 구현된 동작

- 검색 결과와 빈 검색 상태
- 클립마다 독립적인 Motion, Opacity, Time Remapping, 적용 효과 상태
- 슬라이더와 숫자 입력, 효과별 켜기/끄기·초기화·삭제
- 같은 속성을 조절하는 여러 효과의 누적 합성
- 꽃과 자동차 두 실제 영상 사이 Cross Dissolve, Dip to Black, Linear Wipe
- Web Audio 기반 Amplify, Balance, Lowpass
- Carefree / Gymnopedie No. 1 두 음악 클립의 Constant Gain, Constant Power, Exponential Fade 오디오 크로스페이드
- 음악 전환 적용/삭제, 길이 0.5–8초, 경계 구간 듣기 및 곡별 독립 효과
- 선택 클립 전체 초기화

정적 페이지이므로 로컬에서는 HTTP 서버로 열어야 MP4 range 요청과 Web Audio가 안정적으로 동작합니다. 검수 결과와 제한은 `TEST_REPORT.md`에 기록되어 있습니다.

## Audio regression checks

Run `node tests/audio-regression.cjs`, `node --check app.js`, and `node --check music-timeline.js`. In-browser output RMS diagnostics live on the two hidden audio elements (`data-output-rms`, `data-context-state`, `data-fade-gain`); these measure the signal after effects/crossfade, before device output, not speaker audibility.

The demo uses educational gain curves (linear, sine/cosine equal power, normalized exponential); it does not claim sample-for-sample equivalence with Adobe's processing. Music clips meet at the video cut with source handles around the audio transition. With no transition they hard-cut; changing the duration does not move the edit.
