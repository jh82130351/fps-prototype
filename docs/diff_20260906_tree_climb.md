# 변경 diff — 나무 벽타기 + 잎 위 착지

- 일시: 2026-09-06 / 베이스: e6ba1ca
- 대상: index.html(3곳)
- treeTrunks에 topY(잎 꼭대기)·topR(잎 반경) 추가(침엽수/활엽수 구분)
- 나무 줄기: 잎 꼭대기 아래에서만 수평 충돌 + wallGrabTouching=true(닌자 벽타기 대상)
- 잎 꼭대기: 위에서 접근 시에만 발판(groundY) → 밑에서 순간이동 방지
- 상점 벽타기 로직 불변
- 검증: node --check 통과 / jsdom "no script errors"(기존 FAIL 3개만)
