# Browser Test Report

검증일: 2026-11-04 (Asia/Seoul)

실제 ChatGPT 인앱 브라우저에서 `http://127.0.0.1:4187/`로 프로젝트를 열어 확인했습니다.

## 결과

- 꽃 영상: `1920×1080`, `readyState 4`, 재생 중 `currentTime 1.2866초` 확인
- 꽃 영상 경로: `assets/videos/9054643-hd_1920_1080_30fps.mp4`
- Blurriness 슬라이더: `12`로 변경 후 `blur(12px)` 적용 확인
- 자동차 영상: `1920×1080`, `readyState 4`, 재생 중 `currentTime 1.725초` 확인
- 자동차 영상 경로: `assets/videos/5057527-hd_1920_1080_25fps.mp4`
- Saturation 슬라이더: `165`로 변경 후 `saturate(1.65)` 적용 확인

두 영상 모두 Canvas에 그리지 않고 HTML `<video>` 요소가 상대 경로의 MP4 파일을 직접 재생합니다.

## 참고

이전 대화에서 기존 Premiere Effects Lab HTML/ZIP은 첨부되지 않았기 때문에, 이 패키지는 접근 가능한 영상과 요구된 패널 구성을 바탕으로 제작한 복구판입니다. 기존 프로젝트 ZIP을 확보하면 원본 파일 기준으로 정확히 병합할 수 있습니다.
