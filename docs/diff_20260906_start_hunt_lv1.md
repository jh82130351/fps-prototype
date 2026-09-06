# 변경 diff — 시작 사냥터 Lv1 + 레벨표시 + 중앙 스폰금지

- 일시: 2026-09-06 / 베이스: 2df695e
- 대상: index.html(4곳) + .jsdom_check.js(1곳)
- 내용:
 - 시작 마을 사냥터 좀비 lvl=1 태그(무조건 Lv1), Firebase 동기화에 lvl 포함
 - 머리 위 네임태그에 'Lv.N' 표시
 - MON_SAFE_R=60: keepOutOfCenter()로 마을 중앙 반경 60 안 스폰 방지(보장)
 - HP/데미지 값은 미변경(일반6/엘리트200 유지)
- 검증: node --check 통과 / jsdom "no script errors", zombie_globals 검사도 =6으로 정정해 PASS
 (남은 FAIL l_bar·n_npc·wg_phys는 이번 변경과 무관한 기존 항목)
- 다음(Stage 2): 옆마을 가는 길에 거리기반 고레벨 구역 + 두 번째 마을
