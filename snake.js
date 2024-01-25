const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const blockSize = 20;
const canvasSize = canvas.width;

const snake = {
  body: [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ],
  direction: "UP"
};

let food = generateFood();
let score = 0;

const frameRate = 8;

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  drawSnake();
  drawFood();
  drawScore();
}

function drawSnake() {
  ctx.fillStyle = "green";
  snake.body.forEach(segment => {
    ctx.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
  });
}

function drawFood() {
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "18px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function generateFood() {
  const x = Math.floor(Math.random() * (canvasSize / blockSize));
  const y = Math.floor(Math.random() * (canvasSize / blockSize));
  return { x, y };
}

function update() {
  const head = { ...snake.body[0] };

  switch (snake.direction) {
    case "UP":
      head.y -= 1;
      break;
    case "DOWN":
      head.y += 1;
      break;
    case "LEFT":
      head.x -= 1;
      break;
    case "RIGHT":
      head.x += 1;
      break;
  }

  snake.body.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    score++;
  } else {
    snake.body.pop();
  }

  checkCollision();
}

function checkCollision() {
  const head = snake.body[0];

  if (head.x < 0 || head.y < 0 || head.x >= canvasSize / blockSize || head.y >= canvasSize / blockSize) {
    gameOver();
  }

  for (let i = 1; i < snake.body.length; i++) {
    if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
      gameOver();
    }
  }
}

function gameOver() {
  document.getElementById("gameOverMessage").innerText = "Game Over!";
  document.getElementById("scoreDisplay").innerText = `Your Score: ${score}`;
  document.getElementById("gameOverContainer").style.display = "flex";
  document.getElementById("newGameButton").style.display = "block";
}

function startNewGame() {
  document.getElementById("gameOverMessage").innerText = "";
  document.getElementById("scoreDisplay").innerText = "";
  document.getElementById("gameOverContainer").style.display = "none";
  document.getElementById("newGameButton").style.display = "none";
  score = 0;
  snake.body = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ];
  snake.direction = "UP";
  food = generateFood();
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (snake.direction !== "DOWN") snake.direction = "UP";
            break;
        case "ArrowDown":
            if (snake.direction !== "UP") snake.direction = "DOWN";
            break;
        case "ArrowLeft": {
            if (snake.direction !== "RIGHT") snake.direction = "LEFT";
            break;
        } 
        case "ArrowRight":
            if (snake.direction !== "LEFT") snake.direction = "RIGHT";
            break;
    }
});

function gameLoop() {
  update();
  draw();
  setTimeout(() => requestAnimationFrame(gameLoop), 1000 / frameRate);
}

gameLoop();