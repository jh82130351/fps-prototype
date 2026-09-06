# 변경 diff — 얼룩 텍스처 제거(단색 복귀) + 잔디 대량

- 일시: 2026-09-06 / 베이스: c76dea0
- 대상: index.html(3곳)
- texGround/paintPart 무효화 → 바닥·길·광장·상점이 깔끔한 단색으로 복귀(호출부 유지)
- 잔디 밀도 최대 4800 → 16000 (인스턴스 1개, 드로우콜 1 → 성능 부담 적음)
- 유지: ACES 톤매핑, 하늘 그라디언트, PCFSoft 그림자, 연속 계단식 지붕, 교차형 잔디 뭉치
- 참고: TEX_* 상수/생성기는 이제 미사용(무해). 추후 정리 가능. makeGrassBladeTexture는 잔디에 계속 사용.
- 검증: node --check 통과 / jsdom "no script errors" (기존 FAIL l_bar·n_npc·wg_phys만)
