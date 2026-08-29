const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8');
const vc = new VirtualConsole();
let errs = [];
vc.on('jsdomError', e => errs.push('jsdomError: ' + (e && e.message || e)));
vc.on('error', (...a) => errs.push('console.error: ' + a.join(' ')));
vc.on('warn', () => {});
function permissive() {
  return new Proxy(function () {}, {
    get(t, p) { if (p === Symbol.toPrimitive) return () => 0; return permissive(); },
    apply() { return permissive(); },
    construct() { return permissive(); },
    set() { return true; },
  });
}
const stubClasses = ['Scene','Color','Fog','WebGLRenderer','HemisphereLight','DirectionalLight','AmbientLight','PointLight','PlaneGeometry','GridHelper','Mesh','MeshStandardMaterial','MeshBasicMaterial','MeshLambertMaterial','Group','BoxGeometry','CylinderGeometry','SphereGeometry','BufferGeometry','Raycaster','Vector3','Vector2','PerspectiveCamera','Sprite','SpriteMaterial','MathUtils','Clock','CanvasTexture','TextureLoader','Matrix4','Object3D'];
class PermissiveBase { constructor() { return permissive(); } }
PermissiveBase.prototype = new Proxy(PermissiveBase.prototype, { get(t, p) { if (p in t) return t[p]; if (p === Symbol.toPrimitive) return () => 0; return permissive(); }, set() { return true; } });
const stub = {};
for (const c of stubClasses) stub[c] = class extends PermissiveBase {};
stub.WebGLRenderer = class { constructor(){ this.setSize=()=>{}; this.setPixelRatio=()=>{}; this.shadowMap={enabled:false}; this.domElement={}; this.setAnimationLoop=()=>{}; this.render=()=>{}; this.dispose=()=>{}; } };
stub.Scene = class { constructor(){ this.add=()=>{}; this.background=null; this.fog=null; } };
stub.MathUtils = { degToRad: d => d * Math.PI / 180 };
stub.LinearFilter = {}; stub.AdditiveBlending = {};
const Handler = { get(t, prop) { if (prop in t) return t[prop]; if (prop === Symbol.toPrimitive) return () => 0; return permissive(); } };
const THREE = new Proxy(stub, Handler);
const dom = new JSDOM(html, { url: 'https://localhost/', pretendToBeVisual: true, runScripts: 'dangerously', virtualConsole: vc, beforeParse(window) {
  window.THREE = THREE;
  window.Peer = class { constructor(){ this.on=()=>{}; this.connect=()=>({ on:()=>{} }); } };
  window.firebase = { initializeApp: () => ({}), database: () => ({ ref: () => ({ on: () => {}, off: () => {}, set: () => ({ then:()=>({catch:()=>{}}) }), remove: () => ({ then:()=>({catch:()=>{}}) }), push: () => ({ key:'x', set:()=>{} }), update: () => ({ then:()=>({catch:()=>{}}) }) }) }) };
  window.HTMLCanvasElement.prototype.getContext = function () { return { canvas: this, getExtension: () => null, createShader: () => ({}), createProgram: () => ({}), shaderSource: () => {}, compileShader: () => {}, attachShader: () => {}, linkProgram: () => {}, getProgramParameter: () => true, getShaderParameter: () => true, getContextAttributes: () => ({}), drawingBufferWidth: 1, drawingBufferHeight: 1, fillRect: () => {}, clearRect: () => {}, fillText: () => {}, beginPath: () => {}, arc: () => {}, fill: () => {}, stroke: () => {}, closePath: () => {}, moveTo: () => {}, lineTo: () => {}, rect: () => {}, drawImage: () => {}, createElement: () => ({}), set fillStyle(v){}, get fillStyle(){ return '#000'; }, set font(v){}, get font(){ return '10px sans-serif'; }, set textAlign(v){}, get textAlign(){ return 'start'; }, set textBaseline(v){}, get textBaseline(){ return 'alphabetic'; }, measureText: t=>({ width: t.length*8 }), createLinearGradient: ()=>({ addColorStop: () => {} }), createRadialGradient: ()=>({ addColorStop: () => {} }), save: () => {}, restore: () => {}, translate: () => {}, rotate: () => {}, scale: () => {}, clip: () => {}, globalAlpha: 1, width: 64, height: 64 }; };
  window.HTMLElement.prototype.requestPointerLock = window.HTMLElement.prototype.requestPointerLock || function () { return undefined; };
}});
const w = dom.window;
const g = id => w.document.getElementById(id);
const results = {};
const has = (txt) => html.includes(txt);
// ① 사냥터 확장
results.hunt_5x = has("addPart(170, 0.15, 0, 130, 0.3, 130, 0x4a7c3a)");
// ② 전역 선언
results.zombie_globals = has("let isZombieHost = false") && has("let fbZombiesRef = null") && has("const ZOMBIE_HP = 50") && has("const HUNT_CX = 170, HUNT_CZ = 0, HUNT_HALF = 60");
// ③ 호스트 선출
results.host_elect = has("isZombieHost = (minId === myPlayerId)");
// ④ 구독
results.subscription = has("fbZombiesRef = fbdb.ref('zombies')") && has("fbZombiesRef.on('child_added', onZombieUpdate)") && has("fbZombiesRef.on('child_removed'");
// ⑤ 렌더 함수
results.render_fns = has("function onZombieUpdate") && has("function updateZombieRender");
// ⑥ 시뮬 함수
results.sim_fns = has("function playerPositions") && has("function spawnZombies") && has("function updateZombieSim");
// ⑦ animate 훅
results.animate_hook = has("updateZombieRender(dt);") && has("if (!zombieSpawned) { spawnZombies(); zombieSpawned = true; }") && has("fbdb.ref('zombies/'+zid).update");
// ⑧ 정리
results.cleanup = has("if (fbZombiesRef) { try { fbZombiesRef.off(); }") && has("zombieRender = {}; zombieSim = {}; zombieSpawned = false; isZombieHost = false;");
// zombie attack → hits
results.zombie_attack = has("from:'zombie', dmg:(s.elite?ELITE_DMG:ZOMBIE_DMG)");
// ─── B단계: 좀비 처치 + 고기 드롭 + 줍기 ───
// ① 전역 선언
results.b_globals = has("const PLAYER_ATK_DMG = 25") && has("let fbDropsRef = null") && has("const PICKUP_RANGE = 0.5");
// ② doAttack 좀비 타격
results.b_doattack = has("fbdb.ref('zombieHits').push({ zid, by: myPlayerId, dmg: atkDmg") && has("fwd2.dot(dir3) < 0.3") && has("zc.z - camPos2.z");
// ③ 호스트 피격 처리 + 헬퍼
results.b_host_hit = has("fbdb.ref('zombieHits').on('child_added'") && has("s.target = h.by") && has("function respawnOneZombie") && has("spawnDrop(s.x, s.z, { name:'좀비고기'");
// ④ 드롭 생성·공유·줍기
results.b_drop = has("function spawnDrop") && has("function onDropUpdate") && has("fbDropsRef = fbdb.ref('drops')") && has("fbDropsRef.on('child_removed'");
// ⑤ 줍기 판정
results.b_pickup = has("Math.hypot(dx,dz) < PICKUP_RANGE") && has("inventory[slot] = { name:d.item.name") && has("flash('좀비고기 획득')");
// ⑥ 퇴장 정리
results.b_cleanup = has("if (fbDropsRef) { try { fbDropsRef.off(); }") && has("for (const id in drops){ if(drops[id].fig) scene.remove(drops[id].fig); }");
// ─── 손에 든 아이템 (1인칭 + 멀티 전파) ───
// ① 1인칭 뷰모델
results.h_held_view = has("const heldItemView = new THREE.Mesh") && has("heldItemView.position.set(0, 0.02, -0.7)") && has("fistView.add(heldItemView)");
// ② 선택슬롯 갱신
results.h_update_held = has("function updateHeldItem()") && has("updateHeldItem();");
// ③ 멀티 전파 (mpSend held)
results.h_mpsend = has("held: (inventory[selectedSlot] && inventory[selectedSlot].color !== undefined) ? inventory[selectedSlot].color : -1");
// ④ 원격 플레이어 손 아이템
results.h_remote_held = has("d.held !== undefined && d.held !== rp.heldColor") && has("rp.heldMesh") && has("hm.position.set(0.65, 1.1, -0.35)");
// ─── 골드 시스템 + 잡화 상인 판매 ───
// ① 골드 상태
results.g_gold_state = has("let gold = parseInt(localStorage.getItem('fpsGold')") && has("function saveGold()") && has("function addGold(n)") && has("function updateGoldHud()");
// ② 골드 HUD (메인 HUD 텍스트에 통합됨 — 별도 goldHud div 제거)
results.g_gold_hud = has("' 💰 ' + gold") && has("updateGoldHud(){ /* 골드는 메인 HUD 텍스트에 표시됨 */ }");
// ③ 판매 가격표 + UI
results.g_sell = has("const SELL_PRICES = { '좀비고기': 1, '엘리트 좀비고기': 50 }") && has("function countItem") && has("function sellOne") && has("function renderSellList") && has("type === '잡화 상인'");
// 렌더렉: 3개 함수 미생성(sellAll/sellOneNoRefresh/addGoldRefreshAfterSellAll)
results.g_no_fake = !has("function sellAll") && !has("function sellOneNoRefresh") && !has("function addGoldRefreshAfterSellAll");
// ─── 무기점 구매 [1단계: 데이터 + 구매] ───
// ① 무기 데이터
results.w_data = has("const RARITY = { common") && has("const WEAPONS = [") && has("function weaponById") && has("battle_axe");
// ② openShop 무기 상인 분기
results.w_shop = has("type === '무기 상인'") && has("renderWeaponShop(body);");
// ③ 구매 로직
results.w_buy = has("function buyWeapon") && has("function renderWeaponShop") && has("weaponId:w.id") && has("gold < w.price");
// ─── 엘리트 좀비 ───
results.e_const = has("const ELITE_HP = 200, ELITE_CHANCE = 1/80");
results.e_sell = has("'엘리트 좀비고기': 50");
results.e_spawn = has("hp: elite ? ELITE_HP : ZOMBIE_HP") && has("hp: elite?ELITE_HP:ZOMBIE_HP");
results.e_render = has("isElite?0x2f5d2f:0x4a7c3a") && has("fig.scale.set(1.6, 1.6, 1.6)") && has("'엘리트 좀비':'좀비'");
results.e_drop = has("name:'엘리트 좀비고기', color:0xffcc33");
// ─── 무기 전투 적용 [2단계: 스탯 반영] ───
results.wa_stats = has("const atkDmg = w ? w.dmg : 6") && has("const atkCd = w ? w.cd : 0.4") && has("const atkReach = w ? w.range : 4") && has("const atkAoe = w ? w.aoe : false");
results.wa_player = has("dmg: atkDmg") && has("if(!atkAoe) break;") && has("if (dist > atkReach) continue;");
results.wa_zombie = has("if (horiz > atkReach + 1) continue;") && has("zombieHits').push({ zid, by: myPlayerId, dmg: atkDmg") && has("if (!atkAoe) break;");
// ─── 레벨 시스템 + 경험치 막대 [1단계] ───
results.l_state = has("let playerLevel = parseInt(localStorage.getItem('fpsLevel')") && has("let killProgress") && has("function gainKill") && has("function updateLevelBar") && has("function killsForNext");
results.l_bar = has("id=\"levelBar\"") && has("top: 58px") && has("background:linear-gradient(90deg,#2ecc71,#7CFC98)");
results.l_enter = has("lb.style.display='flex';") && has("lb.style.display='none';");
results.l_credit = has("killCredit').push({ who:h.by") && has("fbdb.ref('killCredit').limitToLast(20).on('child_added'") && has("gainKill();");
console.log('=== JSDOM LOAD CHECK (full) ===');
console.log('=== JSDOM LOAD CHECK (hunting ground + zombie A) ===');
let allPass = true;
for (const [k, v] of Object.entries(results)) { console.log('  ' + (v ? 'PASS  ' : 'FAIL  ') + k); if (!v) allPass = false; }
console.log('--- top-level script errors ---');
const relevant = errs.filter(e => !e.toLowerCase().includes('opaque origins') && !e.includes('SecurityError'));
relevant.slice(0, 20).forEach(e => console.log('  ' + e));
if (relevant.length === 0) console.log('  (no script errors)');
console.log(allPass && relevant.length === 0 ? '>>> ALL CHECKS PASSED' : '>>> SOME CHECKS FAILED');
process.exit(allPass && relevant.length === 0 ? 0 : 1);
