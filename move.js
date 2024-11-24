const log = document.getElementById("log");
const gameOverText = document.getElementById("gameOver");
const attackButton = document.getElementById("attack");
const defendButton = document.getElementById("defend");
const waitButton = document.getElementById("wait");
const retryButton = document.getElementById("retryButton");

// 게임 상태
let gameActive = true;
let player = { health: 100, energy: 5, status: null };
let enemy = { health: 100, energy: 5, status: null };

// 로그 추가
function addLog(message) {
  const p = document.createElement("p");
  p.textContent = message;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

// 무작위 이벤트 발생
function randomEvent() {
  const events = [
    { type: "heal", target: "player", value: 10 },
    { type: "heal", target: "enemy", value: 10 },
    { type: "energyBoost", target: "player", value: 2 },
    { type: "energyBoost", target: "enemy", value: 2 },
    { type: "poison", target: "player", value: 5 },
    { type: "poison", target: "enemy", value: 5 },
  ];
  return events[Math.floor(Math.random() * events.length)];
}

// 상태 이상 처리
function applyStatus(character) {
  if (character.status === "poison") {
    character.health -= 5;
    addLog(
      `${
        character === player ? "당신" : "적"
      }은(는) 독에 의해 5의 피해를 입었습니다.`
    );
    if (character.health <= 0) {
      endGame(character === player ? false : true);
    }
  }
}

// 적 행동
function enemyAction() {
  const actions = ["attack", "defend", "wait"];
  return actions[Math.floor(Math.random() * actions.length)];
}

// 행동 처리
function handleAction(playerAction) {
  if (!gameActive) return;

  const enemyMove = enemyAction();
  addLog(`당신의 행동: ${playerAction}, 적의 행동: ${enemyMove}`);

  // 무작위 이벤트 발생
  if (Math.random() < 0.3) {
    const event = randomEvent();
    if (event.target === "player") {
      if (event.type === "heal") {
        player.health += event.value;
        addLog(`무작위 이벤트: 당신이 ${event.value}만큼 회복했습니다.`);
      } else if (event.type === "energyBoost") {
        player.energy += event.value;
        addLog(`무작위 이벤트: 당신의 에너지가 ${event.value} 증가했습니다.`);
      } else if (event.type === "poison") {
        player.status = "poison";
        addLog(`무작위 이벤트: 당신이 독에 걸렸습니다.`);
      }
    } else {
      if (event.type === "heal") {
        enemy.health += event.value;
        addLog(`무작위 이벤트: 적이 ${event.value}만큼 회복했습니다.`);
      } else if (event.type === "energyBoost") {
        enemy.energy += event.value;
        addLog(`무작위 이벤트: 적의 에너지가 ${event.value} 증가했습니다.`);
      } else if (event.type === "poison") {
        enemy.status = "poison";
        addLog(`무작위 이벤트: 적이 독에 걸렸습니다.`);
      }
    }
  }

  // 플레이어 행동 결과
  if (playerAction === "attack" && player.energy > 0) {
    player.energy -= 1;
    if (enemyMove !== "defend") {
      enemy.health -= 20;
      addLog("공격 성공! 적에게 20의 피해를 입혔습니다.");
    } else {
      addLog("적이 방어를 선택하여 공격을 막았습니다.");
    }
  } else if (playerAction === "defend" && player.energy > 0) {
    player.energy -= 1;
    addLog("방어 태세를 유지합니다.");
    if (enemyMove === "attack") {
      addLog("적의 공격을 성공적으로 막았습니다!");
    }
  } else if (playerAction === "wait") {
    player.energy += 2;
    addLog("기다리며 에너지를 회복합니다.");
  } else {
    addLog("에너지가 부족하여 행동할 수 없습니다.");
  }

  // 적 행동 결과
  if (enemyMove === "attack" && enemy.energy > 0) {
    enemy.energy -= 1;
    if (playerAction !== "defend") {
      player.health -= 20;
      addLog("적의 공격 성공! 당신이 20의 피해를 입었습니다.");
    } else {
      addLog("적의 공격을 방어했습니다.");
    }
  } else if (enemyMove === "wait") {
    enemy.energy += 2;
    addLog("적이 에너지를 회복합니다.");
  }

  // 상태 이상 처리
  applyStatus(player);
  applyStatus(enemy);

  // 체력 확인
  if (player.health <= 0) endGame(false);
  if (enemy.health <= 0) endGame(true);

  // 상태 업데이트
  updateStatus();
}

// 게임 상태 업데이트
function updateStatus() {
  document.getElementById("playerHealth").textContent = Math.max(
    0,
    player.health
  );
  document.getElementById("enemyHealth").textContent = Math.max(
    0,
    enemy.health
  );
  document.getElementById("playerEnergy").textContent = player.energy;
  document.getElementById("enemyEnergy").textContent = enemy.energy;
}

// 게임 종료
function endGame(victory) {
  gameActive = false;
  const logElement = document.getElementById("log");

  if (victory) {
    logElement.innerHTML = `
      <p style="color: gold;">승리! 자신과의 싸움에서 승리하셨습니다.</p>
      <blockquote style="color: lightblue;">
        인간 최대의 승리는 내가 나를 이기는 것이다. - 플라톤<br>
        자신을 극복하려면 자신과 싸워야 한다.<br>
        상처야말로 삶이 내게 준 가장 귀한 것.<br>
        왜냐하면 그 하나하나가 한걸음 한 걸음 앞으로 나간 흔적이기 때문에. - 로맹 롤랑
      </blockquote>
    `;
    gameOverText.innerText = "자신과의 싸움에서 승리했습니다!";
    gameOverText.style.color = "gold";
  } else {
    logElement.innerHTML = `
      <p style="color: red;">실패! 자신과의 싸움에서 패배했습니다.</p>
      <blockquote style="color: gray;">
        어차피 나는 아무리 노력해도 변하지 않을 거야.<br>
        그냥 이렇게 살다가 끝나는 게 낫겠지...
      </blockquote>
    `;
    gameOverText.innerText = "자신과의 싸움에서 패배했습니다!";
    gameOverText.style.color = "red";
  }

  // 버튼들 비활성화
  attackButton.disabled = true;
  defendButton.disabled = true;
  waitButton.disabled = true;
  document.getElementById("surrenderButton").disabled = true;

  // 다시 하기 버튼 표시
  retryButton.style.display = "inline-block";
}

// 게임 재시작
function restartGame() {
  // 게임 상태 초기화
  gameActive = true;
  player = { health: 100, energy: 5, status: null };
  enemy = { health: 100, energy: 5, status: null };

  // UI 초기화
  gameOverText.textContent = "";
  log.innerHTML = "<p>새로운 전투가 시작되었습니다.</p>";

  // 버튼 상태 초기화
  attackButton.disabled = false;
  defendButton.disabled = false;
  waitButton.disabled = false;
  document.getElementById("surrenderButton").disabled = false;
  retryButton.style.display = "none";

  // 상태 표시 업데이트
  updateStatus();
}

// 초기화
attackButton.addEventListener("click", () => handleAction("attack"));
defendButton.addEventListener("click", () => handleAction("defend"));
waitButton.addEventListener("click", () => handleAction("wait"));
retryButton.addEventListener("click", restartGame);

updateStatus();
