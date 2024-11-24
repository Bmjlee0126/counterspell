const log = document.getElementById("log");
const gameOverText = document.getElementById("gameOver");
const attackButton = document.getElementById("attack");
const defendButton = document.getElementById("defend");
const waitButton = document.getElementById("wait");

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
    if (character.health <= 0)
      endGame(
        character === player ? "패배" : "승리",
        "독에 의해 사망했습니다."
      );
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
  if (player.health <= 0) endGame("패배", "당신은 적에게 쓰러졌습니다.");
  if (enemy.health <= 0) endGame("승리", "적을 물리쳤습니다.");

  // 상태 업데이트
  updateStatus();
}

// 게임 상태 업데이트
function updateStatus() {
  document.getElementById("playerHealth").textContent = player.health;
  document.getElementById("enemyHealth").textContent = enemy.health;
  document.getElementById("playerEnergy").textContent = player.energy;
  document.getElementById("enemyEnergy").textContent = enemy.energy;
}

// 게임 종료
function endGame(result, message) {
  gameActive = false;
  gameOverText.textContent = `${result}! ${message}`;
  attackButton.disabled = true;
  defendButton.disabled = true;
  waitButton.disabled = true;

  const restartButton = document.createElement("button");
  restartButton.textContent = "다시 시작하기";
  restartButton.style.marginTop = "20px";
  restartButton.addEventListener("click", restartGame);
  gameOverText.appendChild(restartButton);
}

// 게임 재시작
function restartGame() {
  player = { health: 100, energy: 5, status: null };
  enemy = { health: 100, energy: 5, status: null };
  gameActive = true;
  gameOverText.textContent = "";
  log.innerHTML = "<p>새로운 전투가 시작되었습니다.</p>";
  attackButton.disabled = false;
  defendButton.disabled = false;
  waitButton.disabled = false;
  updateStatus();
}

// 초기화
attackButton.addEventListener("click", () => handleAction("attack"));
defendButton.addEventListener("click", () => handleAction("defend"));
waitButton.addEventListener("click", () => handleAction("wait"));
updateStatus();




 //배경음악 컨트롤
const bgm = document.getElementById('bgm');
const toggleMusic = document.getElementById('toggleMusic');
const volumeControl = document.getElementById('volumeControl');

// 음악 초기 설정
bgm.volume = 0.5;  // 초기 볼륨 50%

// 시작 버튼 클릭 시 음악 재생
document.getElementById('startButton').addEventListener('click', function() {
    try {
        bgm.play().catch(function(error) {
            console.log("자동 재생이 차단되었습니다:", error);
        });
    } catch (error) {
        console.log("음악 재생 중 오류 발생:", error);
    }
});

// 음악 켜기/끄기 버튼
toggleMusic.addEventListener('click', function() {
    if (bgm.paused) {
        bgm.play();
        toggleMusic.textContent = '음악 끄기';
    } else {
        bgm.pause();
        toggleMusic.textContent = '음악 켜기';
    }
});

// 볼륨 조절
volumeControl.addEventListener('input', function() {
    bgm.volume = this.value;
});
