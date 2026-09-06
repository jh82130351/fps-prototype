# 변경 diff — 물리 적용(나무 충돌 + 언덕·산 등반)

- 일시: 2026-09-06 / 베이스: 9081e75
- 대상: index.html(8곳)
- 전역 terrainCones(언덕+산) / treeTrunks(나무) 데이터 캡처(buildTerrainScenery)
- 등반: 콘 표면 높이 surf=base+h*(1-dd/r)로 groundY 상승 → 언덕·산 밟고 오름
- 나무: 밑동 반경(0.6*scale)+R로 수평 밀어내기(통과 방지)
- 걷기범위 760→980(산까지 도보 도달)
- 성능: broad-phase 조기탈출(|dx|,|dz|>반경 skip). 콘 ~86 + 나무 ~520
- 검증: node --check 통과 / jsdom "no script errors"(기존 FAIL 3개만)
