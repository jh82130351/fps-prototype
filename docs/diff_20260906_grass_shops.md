# 변경 diff — 잔디 추가 + 상점 외형 고퀄화

- 일시: 2026-09-06 / 베이스: b34c3b9
- 대상: index.html(6곳)
- 잔디: worldDecor 그룹 + InstancedMesh 잔디(~2200개), 길/광장/상점열 제외, 빌드 재진입 시 정리
- 상점(buildingX 전체 적용): 회벽 텍스처, 돌 토대, 모서리 나무기둥, 기와 계단식 지붕(3단+용마루), 천막 차양
- 공유 텍스처(TEX_WALL/ROOF/WOOD/STONE)로 메모리 절약(클론 없이 공유)
- 검증: node --check 통과 / jsdom "no script errors" (기존 FAIL l_bar·n_npc·wg_phys만)
- 참고: 시각 결과 육안 확인 후 잔디 밀도/지붕 단수/텍스처 색 미세조정 예정
