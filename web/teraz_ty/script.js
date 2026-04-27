const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

const world = {
  width: canvas.width,
  height: canvas.height,
  gravity: 0.42,
  jumpForce: -7.4,
  obstacleSpeed: 2.8,
  obstacleWidth: 92,
  gapHeight: 170,
  obstacleSpacing: 230,
};

const cat = {
  x: 92,
  y: world.height / 2,
  width: 52,
  height: 38,
  velocity: 0,
  rotation: 0,
};

let obstacles = [];
let score = 0;
let bestScore = 0;
let isGameOver = false;
let hasStarted = false;
let animationFrameId = 0;

function randomGapY() {
  const margin = 110;
  return margin + Math.random() * (world.height - margin * 2 - world.gapHeight);
}

function createObstacle(offsetX) {
  return {
    x: world.width + offsetX,
    gapY: randomGapY(),
    passed: false,
  };
}

function resetGame() {
  cat.y = world.height / 2;
  cat.velocity = 0;
  cat.rotation = 0;
  score = 0;
  isGameOver = false;
  hasStarted = false;
  scoreElement.textContent = "0";
  obstacles = [createObstacle(160), createObstacle(160 + world.obstacleSpacing)];
}

function jump() {
  if (isGameOver) {
    resetGame();
  }

  hasStarted = true;
  cat.velocity = world.jumpForce;
}

function updateCat() {
  if (!hasStarted || isGameOver) {
    return;
  }

  cat.velocity += world.gravity;
  cat.y += cat.velocity;
  cat.rotation = Math.max(-0.5, Math.min(1, cat.velocity / 10));

  if (cat.y < 0) {
    cat.y = 0;
    cat.velocity = 0;
  }

  if (cat.y + cat.height > world.height) {
    cat.y = world.height - cat.height;
    isGameOver = true;
  }
}

function updateObstacles() {
  for (const obstacle of obstacles) {
    obstacle.x -= world.obstacleSpeed;

    if (!obstacle.passed && obstacle.x + world.obstacleWidth < cat.x) {
      obstacle.passed = true;
      score += 1;
      bestScore = Math.max(bestScore, score);
      scoreElement.textContent = String(score);
    }
  }

  const firstObstacle = obstacles[0];
  if (firstObstacle.x + world.obstacleWidth < -20) {
    obstacles.shift();
    const lastObstacle = obstacles[obstacles.length - 1];
    obstacles.push({
      x: lastObstacle.x + world.obstacleSpacing,
      gapY: randomGapY(),
      passed: false,
    });
  }
}

function collidesWithObstacle(obstacle) {
  const catLeft = cat.x + 6;
  const catRight = cat.x + cat.width - 6;
  const catTop = cat.y + 4;
  const catBottom = cat.y + cat.height - 4;

  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + world.obstacleWidth;
  const gapTop = obstacle.gapY;
  const gapBottom = obstacle.gapY + world.gapHeight;

  const overlapsX = catRight > obstacleLeft && catLeft < obstacleRight;
  const hitsTop = catTop < gapTop;
  const hitsBottom = catBottom > gapBottom;

  return overlapsX && (hitsTop || hitsBottom);
}

function checkCollisions() {
  for (const obstacle of obstacles) {
    if (collidesWithObstacle(obstacle)) {
      isGameOver = true;
      return;
    }
  }
}

function drawBackground() {
  const skyGradient = context.createLinearGradient(0, 0, 0, world.height);
  skyGradient.addColorStop(0, "#fef3c7");
  skyGradient.addColorStop(0.45, "#fdba74");
  skyGradient.addColorStop(1, "#fb7185");
  context.fillStyle = skyGradient;
  context.fillRect(0, 0, world.width, world.height);

  context.fillStyle = "rgba(255, 255, 255, 0.5)";
  context.beginPath();
  context.arc(80, 100, 34, 0, Math.PI * 2);
  context.arc(110, 92, 26, 0, Math.PI * 2);
  context.arc(142, 102, 30, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.arc(290, 150, 28, 0, Math.PI * 2);
  context.arc(320, 144, 22, 0, Math.PI * 2);
  context.arc(347, 152, 24, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#7c3f00";
  context.fillRect(0, world.height - 42, world.width, 42);
  context.fillStyle = "#65a30d";
  context.fillRect(0, world.height - 52, world.width, 12);
}

function drawObstacle(obstacle) {
  const topHeight = obstacle.gapY;
  const bottomY = obstacle.gapY + world.gapHeight;
  const bottomHeight = world.height - bottomY;

  drawCatColumn(obstacle.x, 0, world.obstacleWidth, topHeight, true);
  drawCatColumn(obstacle.x, bottomY, world.obstacleWidth, bottomHeight, false);
}

function drawCatColumn(x, y, width, height, upsideDown) {
  context.save();
  context.translate(x + width / 2, y + height / 2);
  if (upsideDown) {
    context.rotate(Math.PI);
  }
  context.translate(-(x + width / 2), -(y + height / 2));

  context.fillStyle = "#f59e0b";
  context.fillRect(x + 14, y, width - 28, height);

  context.fillStyle = "#78350f";
  for (let stripeY = y + 20; stripeY < y + height; stripeY += 34) {
    context.fillRect(x + 18, stripeY, width - 36, 8);
  }

  context.fillStyle = "#fcd34d";
  context.beginPath();
  context.ellipse(x + width / 2, y + 28, width / 2.4, 26, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#78350f";
  context.beginPath();
  context.moveTo(x + 20, y + 18);
  context.lineTo(x + 30, y + 2);
  context.lineTo(x + 40, y + 22);
  context.fill();

  context.beginPath();
  context.moveTo(x + width - 20, y + 18);
  context.lineTo(x + width - 30, y + 2);
  context.lineTo(x + width - 40, y + 22);
  context.fill();

  context.fillStyle = "#1f2937";
  context.beginPath();
  context.arc(x + width / 2 - 12, y + 28, 3.5, 0, Math.PI * 2);
  context.arc(x + width / 2 + 12, y + 28, 3.5, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#1f2937";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(x + width / 2, y + 38, 9, 0.2, Math.PI - 0.2);
  context.stroke();

  context.restore();
}

function drawFlyingCat() {
  context.save();
  context.translate(cat.x + cat.width / 2, cat.y + cat.height / 2);
  context.rotate(cat.rotation);
  context.translate(-cat.width / 2, -cat.height / 2);

  context.fillStyle = "#f59e0b";
  context.beginPath();
  context.ellipse(cat.width / 2, cat.height / 2, 22, 16, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#78350f";
  context.beginPath();
  context.moveTo(10, 10);
  context.lineTo(16, 0);
  context.lineTo(22, 12);
  context.fill();

  context.beginPath();
  context.moveTo(cat.width - 10, 10);
  context.lineTo(cat.width - 16, 0);
  context.lineTo(cat.width - 22, 12);
  context.fill();

  context.fillStyle = "#1f2937";
  context.beginPath();
  context.arc(18, 18, 3, 0, Math.PI * 2);
  context.arc(34, 18, 3, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "#1f2937";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(26, 24, 6, 0.1, Math.PI - 0.1);
  context.stroke();

  context.strokeStyle = "#92400e";
  context.beginPath();
  context.moveTo(44, 24);
  context.quadraticCurveTo(58, 18, 48, 6);
  context.stroke();

  context.restore();
}

function drawOverlay() {
  if (!hasStarted && !isGameOver) {
    context.fillStyle = "rgba(255, 255, 255, 0.92)";
    context.font = "600 18px Trebuchet MS, sans-serif";
    context.textAlign = "center";
    context.fillText("Klikni pre prvy skok", world.width / 2, 70);
    return;
  }

  if (!isGameOver) {
    return;
  }

  context.fillStyle = "rgba(17, 24, 39, 0.72)";
  context.fillRect(32, 210, world.width - 64, 170);

  context.fillStyle = "#fff7ed";
  context.textAlign = "center";
  context.font = "700 34px Trebuchet MS, sans-serif";
  context.fillText("Koniec hry", world.width / 2, 270);

  context.font = "600 20px Trebuchet MS, sans-serif";
  context.fillText(`Skore: ${score}`, world.width / 2, 314);
  context.fillText(`Best: ${bestScore}`, world.width / 2, 344);

  context.font = "500 17px Trebuchet MS, sans-serif";
  context.fillText("Klikni alebo stlac medzernik pre restart", world.width / 2, 382);
}

function render() {
  drawBackground();
  for (const obstacle of obstacles) {
    drawObstacle(obstacle);
  }
  drawFlyingCat();
  drawOverlay();
}

function gameLoop() {
  updateCat();

  if (hasStarted && !isGameOver) {
    updateObstacles();
    checkCollisions();
  }

  render();
  animationFrameId = window.requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    jump();
  }
});

canvas.addEventListener("pointerdown", jump);
restartButton.addEventListener("click", resetGame);

resetGame();
cancelAnimationFrame(animationFrameId);
gameLoop();