// Game 0: Snake Feast
function initSnakeGame(canvas, ctx) {
  const gridSize = 20;
  let snake = [{x: 10, y: 10}];
  let food = {x: 15, y: 15};
  let dx = 1, dy = 0;
  let score = 0;
  let speed = 100;

  document.addEventListener('keydown', changeDirection);

  function changeDirection(e) {
    const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
    const keyPressed = e.keyCode;
    
    if (keyPressed === LEFT && dx === 0) { dx = -1; dy = 0; }
    if (keyPressed === UP && dy === 0) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT && dx === 0) { dx = 1; dy = 0; }
    if (keyPressed === DOWN && dy === 0) { dx = 0; dy = 1; }
  }

  function gameLoop() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= canvas.width/gridSize || head.y < 0 || head.y >= canvas.height/gridSize) {
      alert(`Game Over! Score: ${score}`);
      return;
    }

    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        alert(`Game Over! Score: ${score}`);
        return;
      }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
      };
    } else {
      snake.pop();
    }

    ctx.fillStyle = '#0f0';
    for (let segment of snake) {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    setTimeout(gameLoop, speed);
  }

  gameLoop();
}

// Game 1: Space Invaders
function initSpaceInvaders(canvas, ctx) {
  let player = {x: canvas.width / 2, y: canvas.height - 60, width: 40, height: 40};
  let bullets = [];
  let aliens = [];
  let score = 0;
  let gameActive = true;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      aliens.push({x: col * 70 + 50, y: row * 50 + 50, width: 40, height: 40, alive: true});
    }
  }

  document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if (e.key === 'ArrowLeft' && player.x > 0) player.x -= 20;
    if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += 20;
    if (e.key === ' ') {
      bullets.push({x: player.x + player.width / 2, y: player.y, width: 4, height: 15});
    }
  });

  function gameLoop() {
    if (!gameActive) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0ff';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    bullets = bullets.filter(b => b.y > 0);
    bullets.forEach(b => {
      b.y -= 8;
      ctx.fillStyle = '#ff0';
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });

    aliens.forEach(alien => {
      if (!alien.alive) return;
      ctx.fillStyle = '#0f0';
      ctx.fillRect(alien.x, alien.y, alien.width, alien.height);

      bullets.forEach(bullet => {
        if (bullet.x > alien.x && bullet.x < alien.x + alien.width &&
            bullet.y > alien.y && bullet.y < alien.y + alien.height) {
          alien.alive = false;
          score += 10;
          bullet.y = -100;
        }
      });
    });

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText('SPACE to shoot, Arrow keys to move', 10, canvas.height - 20);

    if (aliens.every(a => !a.alive)) {
      ctx.fillText('YOU WIN!', canvas.width / 2 - 60, canvas.height / 2);
      gameActive = false;
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Game 2: Color Match
function initColorMatch(canvas, ctx) {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  let targetColor = colors[Math.floor(Math.random() * colors.length)];
  let score = 0;
  let timeLeft = 30;

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const boxSize = canvas.width / 3;
    const row = Math.floor(y / boxSize);
    const col = Math.floor(x / boxSize);
    const index = row * 3 + col;

    if (index < colors.length && colors[index] === targetColor) {
      score += 10;
      targetColor = colors[Math.floor(Math.random() * colors.length)];
    } else {
      score = Math.max(0, score - 5);
    }
  });

  setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      alert(`Game Over! Final Score: ${score}`);
    }
  }, 1000);

  function gameLoop() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const boxSize = canvas.width / 3;
    for (let i = 0; i < 6; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      ctx.fillStyle = colors[i];
      ctx.fillRect(col * boxSize + 10, row * boxSize + 100, boxSize - 20, boxSize - 20);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText(`Match this color:`, 10, 40);
    ctx.fillStyle = targetColor;
    ctx.fillRect(10, 50, 80, 40);
    ctx.fillStyle = '#fff';
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 40);
    ctx.fillText(`Time: ${timeLeft}s`, canvas.width - 150, 80);

    if (timeLeft > 0) {
      requestAnimationFrame(gameLoop);
    }
  }

  gameLoop();
}

// Game 3: Brick Breaker
function initBrickBreaker(canvas, ctx) {
  const paddle = {x: canvas.width / 2 - 50, y: canvas.height - 30, width: 100, height: 10};
  const ball = {x: canvas.width / 2, y: canvas.height / 2, radius: 8, dx: 4, dy: -4};
  const bricks = [];
  let score = 0;

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 10; col++) {
      bricks.push({
        x: col * 80 + 10, 
        y: row * 30 + 50, 
        width: 70, 
        height: 20, 
        alive: true
      });
    }
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    paddle.x = e.clientX - rect.left - paddle.width / 2;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x));
  });

  function gameLoop() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx = -ball.dx;
    if (ball.y - ball.radius < 0) ball.dy = -ball.dy;

    if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    }

    if (ball.y + ball.radius > canvas.height) {
      alert(`Game Over! Score: ${score}`);
      return;
    }

    bricks.forEach(brick => {
      if (!brick.alive) return;
      if (ball.x > brick.x && ball.x < brick.x + brick.width &&
          ball.y > brick.y && ball.y < brick.y + brick.height) {
        brick.alive = false;
        ball.dy = -ball.dy;
        score += 10;
      }
    });

    ctx.fillStyle = '#0ff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    bricks.forEach(brick => {
      if (brick.alive) {
        ctx.fillStyle = '#f0f';
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (bricks.every(b => !b.alive)) {
      ctx.fillText('YOU WIN!', canvas.width / 2 - 60, canvas.height / 2);
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Game 4: Gem Catcher
function initGemCatcher(canvas, ctx) {
  const basket = {x: canvas.width / 2 - 50, y: canvas.height - 80, width: 100, height: 60};
  let items = [];
  let score = 0;
  let gameActive = true;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left - basket.width / 2;
  });

  setInterval(() => {
    if (gameActive) {
      items.push({
        x: Math.random() * (canvas.width - 30),
        y: 0,
        size: 30,
        type: Math.random() > 0.3 ? 'gem' : 'bomb'
      });
    }
  }, 800);

  function gameLoop() {
    if (!gameActive) return;

    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    items = items.filter(item => item.y < canvas.height);
    items.forEach(item => {
      item.y += 3;
      
      if (item.type === 'gem') {
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.arc(item.x + item.size / 2, item.y + item.size / 2, item.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#f00';
        ctx.fillRect(item.x, item.y, item.size, item.size);
      }

      if (item.y + item.size >= basket.y && item.x + item.size >= basket.x && item.x <= basket.x + basket.width) {
        if (item.type === 'gem') {
          score += 10;
        } else {
          alert(`Game Over! Final Score: ${score}`);
          gameActive = false;
        }
        item.y = canvas.height + 100;
      }
    });

    ctx.fillStyle = '#ff0';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText('Move mouse to catch gems, avoid bombs!', 10, canvas.height - 20);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Game 5: Memory Cards
function initMemoryCards(canvas, ctx) {
  const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#f80', '#08f'];
  const cards = [...colors, ...colors].sort(() => Math.random() - 0.5);
  const cardWidth = 80;
  const cardHeight = 100;
  let revealed = [];
  let matched = [];
  let score = 0;

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / (cardWidth + 10));
    const row = Math.floor((y - 100) / (cardHeight + 10));
    const index = row * 4 + col;

    if (index >= 0 && index < 16 && revealed.length < 2 && !revealed.includes(index) && !matched.includes(index)) {
      revealed.push(index);

      if (revealed.length === 2) {
        if (cards[revealed[0]] === cards[revealed[1]]) {
          matched.push(...revealed);
          score += 20;
          revealed = [];
        } else {
          setTimeout(() => { revealed = []; }, 800);
        }
      }
    }
  });

  function gameLoop() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 16; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = col * (cardWidth + 10) + 50;
      const y = row * (cardHeight + 10) + 100;

      if (matched.includes(i)) {
        ctx.fillStyle = cards[i];
      } else if (revealed.includes(i)) {
        ctx.fillStyle = cards[i];
      } else {
        ctx.fillStyle = '#555';
      }

      ctx.fillRect(x, y, cardWidth, cardHeight);
    }

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 40);

    if (matched.length === 16) {
      ctx.fillText('YOU WIN!', canvas.width / 2 - 70, 70);
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Game 6: Rocket Dodge
function initRocketDodge(canvas, ctx) {
  const rocket = {x: canvas.width / 2, y: canvas.height - 80, width: 30, height: 50};
  let asteroids = [];
  let score = 0;
  let gameActive = true;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && rocket.x > 0) rocket.x -= 20;
    if (e.key === 'ArrowRight' && rocket.x < canvas.width - rocket.width) rocket.x += 20;
  });

  setInterval(() => {
    if (gameActive) {
      asteroids.push({
        x: Math.random() * (canvas.width - 40),
        y: 0,
        size: 30 + Math.random() * 30,
        speed: 2 + Math.random() * 3
      });
    }
  }, 600);

  function gameLoop() {
    if (!gameActive) return;

    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    score++;

    asteroids = asteroids.filter(a => a.y < canvas.height);
    asteroids.forEach(asteroid => {
      asteroid.y += asteroid.speed;
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.arc(asteroid.x, asteroid.y, asteroid.size / 2, 0, Math.PI * 2);
      ctx.fill();

      if (asteroid.y + asteroid.size / 2 > rocket.y && 
          asteroid.x > rocket.x && asteroid.x < rocket.x + rocket.width) {
        alert(`Game Over! Score: ${Math.floor(score / 10)}`);
        gameActive = false;
      }
    });

    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.moveTo(rocket.x + rocket.width / 2, rocket.y);
    ctx.lineTo(rocket.x, rocket.y + rocket.height);
    ctx.lineTo(rocket.x + rocket.width, rocket.y + rocket.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${Math.floor(score / 10)}`, 10, 30);
    ctx.fillText('Arrow keys to move', 10, canvas.height - 20);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Game 7: 2048
function init2048(canvas, ctx) {
  const gridSize = 4;
  const tileSize = 100;
  const gap = 10;
  let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  let score = 0;

  function addRandomTile() {
    const empty = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === 0) empty.push({r, c});
      }
    }
    if (empty.length > 0) {
      const {r, c} = empty[Math.floor(Math.random() * empty.length)];
      grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  addRandomTile();
  addRandomTile();

  document.addEventListener('keydown', (e) => {
    let moved = false;
    if (e.key === 'ArrowLeft') moved = moveLeft();
    if (e.key === 'ArrowRight') moved = moveRight();
    if (e.key === 'ArrowUp') moved = moveUp();
    if (e.key === 'ArrowDown') moved = moveDown();
    if (moved) addRandomTile();
  });

  function moveLeft() {
    let moved = false;
    for (let r = 0; r < gridSize; r++) {
      const row = grid[r].filter(x => x !== 0);
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          score += row[i];
          row.splice(i + 1, 1);
        }
      }
      while (row.length < gridSize) row.push(0);
      if (JSON.stringify(grid[r]) !== JSON.stringify(row)) moved = true;
      grid[r] = row;
    }
    return moved;
  }

  function moveRight() {
    grid = grid.map(row => row.reverse());
    const moved = moveLeft();
    grid = grid.map(row => row.reverse());
    return moved;
  }

  function moveUp() {
    grid = transpose(grid);
    const moved = moveLeft();
    grid = transpose(grid);
    return moved;
  }

  function moveDown() {
    grid = transpose(grid);
    const moved = moveRight();
    grid = transpose(grid);
    return moved;
  }

  function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
  }

  function getTileColor(value) {
    const colors = {
      0: '#ccc0b3', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179',
      16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72',
      256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
  }

  function gameLoop() {
    ctx.fillStyle = '#bbada0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const offsetX = (canvas.width - (tileSize * gridSize + gap * (gridSize - 1))) / 2;
    const offsetY = 100;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const value = grid[r][c];
        const x = offsetX + c * (tileSize + gap);
        const y = offsetY + r * (tileSize + gap);

        ctx.fillStyle = getTileColor(value);
        ctx.fillRect(x, y, tileSize, tileSize);

        if (value !== 0) {
          ctx.fillStyle = value <= 4 ? '#776e65' : '#f9f6f2';
          ctx.font = 'bold 40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(value, x + tileSize / 2, y + tileSize / 2);
        }
      }
    }

    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 50);
    ctx.font = '18px Arial';
    ctx.fillText('Use Arrow Keys', 10, canvas.height - 20);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Game 8: Reflex Tester
function initReflexTester(canvas, ctx) {
  let state = 'waiting';
  let startTime = 0;
  let reactionTime = 0;
  let bestTime = Infinity;

  function startTest() {
    state = 'waiting';
    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
      state = 'ready';
      startTime = Date.now();
    }, delay);
  }

  canvas.addEventListener('click', () => {
    if (state === 'ready') {
      reactionTime = Date.now() - startTime;
      bestTime = Math.min(bestTime, reactionTime);
      state = 'result';
      setTimeout(startTest, 2000);
    } else if (state === 'start') {
      startTest();
    }
  });

  state = 'start';

  function gameLoop() {
    if (state === 'waiting') {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Wait...', canvas.width / 2, canvas.height / 2);
    } else if (state === 'ready') {
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CLICK NOW!', canvas.width / 2, canvas.height / 2);
    } else if (state === 'result') {
      ctx.fillStyle = '#0000ff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${reactionTime}ms`, canvas.width / 2, canvas.height / 2 - 40);
      ctx.fillText(`Best: ${bestTime === Infinity ? '-' : bestTime + 'ms'}`, canvas.width / 2, canvas.height / 2 + 20);
    } else {
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
    }

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Game 9: Aim Master
function initAimMaster(canvas, ctx) {
  let targets = [];
  let score = 0;
  let timeLeft = 30;

  setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      alert(`Game Over! Final Score: ${score}`);
    }
  }, 1000);

  setInterval(() => {
    if (timeLeft > 0) {
      targets.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        radius: 30,
        life: 2
      });
    }
  }, 500);

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    for (let i = targets.length - 1; i >= 0; i--) {
      const target = targets[i];
      const dist = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
      if (dist < target.radius) {
        score += 10;
        targets.splice(i, 1);
        break;
      }
    }
  });

  function gameLoop() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    targets = targets.filter(t => t.life-- > 0);

    targets.forEach(target => {
      ctx.strokeStyle = '#f00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(target.x, target.y, target.radius / 2, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Time: ${timeLeft}s`, canvas.width - 120, 30);

    if (timeLeft > 0) {
      requestAnimationFrame(gameLoop);
    }
  }

  gameLoop();
}

// Game 10: Jump Runner
function initJumpRunner(canvas, ctx) {
  const player = {x: 100, y: canvas.height - 100, width: 40, height: 40, dy: 0, jumping: false};
  const gravity = 0.6;
  const jumpPower = -12;
  let obstacles = [];
  let score = 0;
  let gameActive = true;
  let speed = 5;

  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'ArrowUp') && !player.jumping) {
      player.dy = jumpPower;
      player.jumping = true;
    }
  });

  setInterval(() => {
    if (gameActive) {
      obstacles.push({x: canvas.width, y: canvas.height - 80, width: 30, height: 60});
    }
  }, 1500);

  function gameLoop() {
    if (!gameActive) return;

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

    player.dy += gravity;
    player.y += player.dy;

    if (player.y >= canvas.height - 100) {
      player.y = canvas.height - 100;
      player.dy = 0;
      player.jumping = false;
    }

    ctx.fillStyle = '#f00';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    obstacles = obstacles.filter(o => o.x > -o.width);
    obstacles.forEach(obstacle => {
      obstacle.x -= speed;
      ctx.fillStyle = '#0f0';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      if (obstacle.x < player.x + player.width && obstacle.x + obstacle.width > player.x &&
          obstacle.y < player.y + player.height && obstacle.y + obstacle.height > player.y) {
        alert(`Game Over! Score: ${score}`);
        gameActive = false;
      }

      if (obstacle.x + obstacle.width < player.x && !obstacle.scored) {
        obstacle.scored = true;
        score++;
      }
    });

    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText('Press SPACE or UP to jump', 10, 60);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

// Games 11-19: Simplified versions
function initBalloonPop(canvas, ctx) {
  let balloons = [];
  let score = 0;
  let timeLeft = 30;

  setInterval(() => { timeLeft--; if (timeLeft <= 0) alert(`Final Score: ${score}`); }, 1000);
  setInterval(() => {
    if (timeLeft > 0) {
      balloons.push({
        x: Math.random() * (canvas.width - 50),
        y: canvas.height,
        radius: 30 + Math.random() * 20,
        speed: 2 + Math.random() * 3,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
  }, 600);

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];
      if (Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2) < b.radius) {
        score += 10;
        balloons.splice(i, 1);
        break;
      }
    }
  });

  function gameLoop() {
    ctx.fillStyle = '#e0f7fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    balloons = balloons.filter(b => b.y > -b.radius);
    balloons.forEach(b => {
      b.y -= b.speed;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.moveTo(b.x, b.y + b.radius);
      ctx.lineTo(b.x, b.y + b.radius + 30);
      ctx.stroke();
    });
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}  Time: ${timeLeft}s`, 10, 30);
    if (timeLeft > 0) requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initSpiralDash(canvas, ctx) {
  let angle = 0;
  let radius = 50;
  let playerAngle = 0;
  let score = 0;
  let obstacles = [];
  let gameActive = true;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') playerAngle -= 0.2;
    if (e.key === 'ArrowRight') playerAngle += 0.2;
  });

  setInterval(() => {
    if (gameActive) obstacles.push({angle: Math.random() * Math.PI * 2, radius: radius});
  }, 1000);

  function gameLoop() {
    if (!gameActive) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    ctx.strokeStyle = '#333';
    for (let r = 50; r < 300; r += 50) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    radius += 0.5;
    if (radius > 250) {
      score++;
      radius = 50;
      obstacles = [];
    }

    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.arc(cx + Math.cos(playerAngle) * radius, cy + Math.sin(playerAngle) * radius, 10, 0, Math.PI * 2);
    ctx.fill();

    obstacles.forEach(obs => {
      ctx.fillStyle = '#f00';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(obs.angle) * obs.radius, cy + Math.sin(obs.angle) * obs.radius, 15, 0, Math.PI * 2);
      ctx.fill();
      if (Math.abs(obs.radius - radius) < 20 && Math.abs(obs.angle - playerAngle) < 0.3) {
        alert(`Game Over! Score: ${score}`);
        gameActive = false;
      }
    });

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initPianoTiles(canvas, ctx) {
  const tileHeight = 150;
  const tileWidth = canvas.width / 4;
  let tiles = [];
  let score = 0;
  let gameActive = true;
  let speed = 3;

  for (let i = 0; i < 5; i++) {
    tiles.push({col: Math.floor(Math.random() * 4), y: -i * tileHeight, clicked: false});
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const col = Math.floor(x / tileWidth);
    for (let tile of tiles) {
      if (tile.col === col && tile.y > 0 && tile.y < canvas.height && !tile.clicked) {
        tile.clicked = true;
        score++;
        break;
      }
    }
  });

  function gameLoop() {
    if (!gameActive) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    tiles.forEach(tile => {
      tile.y += speed;
      if (!tile.clicked) {
        ctx.fillStyle = '#000';
        ctx.fillRect(tile.col * tileWidth, tile.y, tileWidth - 2, tileHeight - 2);
      }
      if (tile.y > canvas.height && !tile.clicked) {
        alert(`Game Over! Score: ${score}`);
        gameActive = false;
      }
    });

    tiles = tiles.filter(t => t.y < canvas.height + tileHeight);
    while (tiles.length < 5) {
      tiles.push({col: Math.floor(Math.random() * 4), y: tiles[0].y - tileHeight, clicked: false});
    }

    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initColorSwitch(canvas, ctx) {
  const colors = ['#f00', '#0f0', '#00f', '#ff0'];
  let playerColor = 0;
  let obstacles = [];
  let playerY = canvas.height - 100;
  let dy = 0;
  let score = 0;
  let gameActive = true;

  canvas.addEventListener('click', () => {
    dy = -10;
    playerColor = (playerColor + 1) % 4;
  });

  setInterval(() => {
    if (gameActive) obstacles.push({y: -50, color: Math.floor(Math.random() * 4), x: canvas.width / 2});
  }, 2000);

  function gameLoop() {
    if (!gameActive) return;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dy += 0.5;
    playerY += dy;
    if (playerY > canvas.height - 100) { playerY = canvas.height - 100; dy = 0; }

    ctx.fillStyle = colors[playerColor];
    ctx.beginPath();
    ctx.arc(canvas.width / 2, playerY, 20, 0, Math.PI * 2);
    ctx.fill();

    obstacles.forEach(obs => {
      obs.y += 3;
      ctx.strokeStyle = colors[obs.color];
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(obs.x, obs.y, 40, 0, Math.PI * 2);
      ctx.stroke();

      if (Math.abs(obs.y - playerY) < 30 && obs.color !== playerColor) {
        alert(`Game Over! Score: ${score}`);
        gameActive = false;
      }
      if (obs.y > playerY && !obs.passed) { obs.passed = true; score++; }
    });

    obstacles = obstacles.filter(o => o.y < canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initSlotMachine(canvas, ctx) {
  const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
  let reels = [0, 0, 0];
  let spinning = false;
  let score = 100;

  canvas.addEventListener('click', () => {
    if (!spinning && score >= 10) {
      spinning = true;
      score -= 10;
      let spins = 0;
      const interval = setInterval(() => {
        reels = reels.map(() => Math.floor(Math.random() * symbols.length));
        spins++;
        if (spins > 20) {
          clearInterval(interval);
          spinning = false;
          if (reels[0] === reels[1] && reels[1] === reels[2]) {
            score += 100;
          } else if (reels[0] === reels[1] || reels[1] === reels[2]) {
            score += 20;
          }
        }
      }, 100);
    }
  });

  function gameLoop() {
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(50, 150, canvas.width - 100, 200);

    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    reels.forEach((reel, i) => {
      ctx.fillText(symbols[reel], (i + 1) * canvas.width / 4, 280);
    });

    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText(`Credits: ${score}`, canvas.width / 2, 100);
    ctx.font = '20px Arial';
    ctx.fillText(spinning ? 'Spinning...' : 'Click to Spin (10 credits)', canvas.width / 2, 400);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initSlidePuzzle(canvas, ctx) {
  const size = 4;
  const tileSize = Math.min(canvas.width, canvas.height - 100) / size;
  let tiles = Array.from({length: size * size - 1}, (_, i) => i + 1).concat(0);
  tiles.sort(() => Math.random() - 0.5);

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - 50) / tileSize);
    const y = Math.floor((e.clientY - rect.top - 100) / tileSize);
    const idx = y * size + x;
    const emptyIdx = tiles.indexOf(0);
    const emptyX = emptyIdx % size;
    const emptyY = Math.floor(emptyIdx / size);

    if ((Math.abs(x - emptyX) === 1 && y === emptyY) || (Math.abs(y - emptyY) === 1 && x === emptyX)) {
      [tiles[idx], tiles[emptyIdx]] = [tiles[emptyIdx], tiles[idx]];
    }
  });

  function gameLoop() {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < size * size; i++) {
      const x = (i % size) * tileSize + 50;
      const y = Math.floor(i / size) * tileSize + 100;
      if (tiles[i] !== 0) {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tiles[i], x + tileSize / 2, y + tileSize / 2);
      }
    }

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Click tiles to solve!', 10, 50);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initDartMaster(canvas, ctx) {
  const board = {x: canvas.width / 2, y: canvas.height / 2, radius: 150};
  let score = 0;
  let darts = 10;

  canvas.addEventListener('click', (e) => {
    if (darts <= 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dist = Math.sqrt((x - board.x) ** 2 + (y - board.y) ** 2);
    
    darts--;
    if (dist < 20) score += 50;
    else if (dist < 60) score += 30;
    else if (dist < 100) score += 20;
    else if (dist < board.radius) score += 10;
  });

  function gameLoop() {
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(board.x, board.y, board.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(board.x, board.y, 100, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(board.x, board.y, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(board.x, board.y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Darts: ${darts}`, 10, 60);
    if (darts === 0) ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 100, 50);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initRainbowRun(canvas, ctx) {
  const colors = ['#f00', '#ff7f00', '#ff0', '#0f0', '#00f', '#4b0082', '#9400d3'];
  const player = {x: 100, y: canvas.height / 2, radius: 20, colorIdx: 0};
  let obstacles = [];
  let score = 0;
  let gameActive = true;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && player.y > player.radius) player.y -= 20;
    if (e.key === 'ArrowDown' && player.y < canvas.height - player.radius) player.y += 20;
  });

  setInterval(() => {
    if (gameActive) {
      obstacles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 100) + 50,
        colorIdx: Math.floor(Math.random() * colors.length),
        size: 30
      });
    }
  }, 800);

  canvas.addEventListener('click', () => {
    player.colorIdx = (player.colorIdx + 1) % colors.length;
  });

  function gameLoop() {
    if (!gameActive) return;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors[player.colorIdx];
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    obstacles = obstacles.filter(o => o.x > -o.size);
    obstacles.forEach(obs => {
      obs.x -= 5;
      ctx.fillStyle = colors[obs.colorIdx];
      ctx.fillRect(obs.x, obs.y, obs.size, obs.size);

      const dist = Math.sqrt((player.x - obs.x) ** 2 + (player.y - obs.y) ** 2);
      if (dist < player.radius + obs.size / 2) {
        if (player.colorIdx === obs.colorIdx) {
          score += 10;
          obs.x = -1000;
        } else {
          alert(`Game Over! Score: ${score}`);
          gameActive = false;
        }
      }
    });

    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText('Click to change color, Arrows to move', 10, canvas.height - 20);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}

function initStarCollector(canvas, ctx) {
  const player = {x: canvas.width / 2, y: canvas.height / 2, radius: 20};
  let stars = [];
  let blackHoles = [];
  let score = 0;
  let gameActive = true;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left;
    player.y = e.clientY - rect.top;
  });

  setInterval(() => {
    if (gameActive) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 10
      });
      if (Math.random() < 0.3) {
        blackHoles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 15
        });
      }
    }
  }, 500);

  function gameLoop() {
    if (!gameActive) return;
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars = stars.filter(star => {
      const dist = Math.sqrt((player.x - star.x) ** 2 + (player.y - star.y) ** 2);
      if (dist < player.radius + star.radius) {
        score += 10;
        return false;
      }
      return true;
    });

    blackHoles.forEach(hole => {
      const dist = Math.sqrt((player.x - hole.x) ** 2 + (player.y - hole.y) ** 2);
      if (dist < player.radius + hole.radius) {
        alert(`Game Over! Score: ${score}`);
        gameActive = false;
      }
    });

    stars.forEach(star => {
      ctx.fillStyle = '#ff0';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    blackHoles.forEach(hole => {
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f0f';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    ctx.fillStyle = '#0ff';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText('Move mouse to collect stars!', 10, canvas.height - 20);
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
}
