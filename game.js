const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 12, paddleHeight = 90;
const ballRadius = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;
let leftScore = 0, rightScore = 0;

// Ball initial state
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1)
};

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddleY = mouseY - paddleHeight / 2;

    // Clamp paddle within canvas
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY > canvas.height - paddleHeight) leftPaddleY = canvas.height - paddleHeight;
});

// Draw paddles, ball, and net
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw net
    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Draw scores
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(leftScore, canvas.width / 4, 50);
    ctx.fillText(rightScore, 3 * canvas.width / 4, 50);
}

// Ball and paddle collision detection
function collision(paddleX, paddleY) {
    return (
        ball.x - ballRadius < paddleX + paddleWidth &&
        ball.x + ballRadius > paddleX &&
        ball.y + ballRadius > paddleY &&
        ball.y - ballRadius < paddleY + paddleHeight
    );
}

// Simple AI for right paddle
function moveRightPaddle() {
    // AI follows the ball, but not perfectly
    let paddleCenter = rightPaddleY + paddleHeight / 2;
    if (ball.y < paddleCenter - 10) {
        rightPaddleY -= 5;
    } else if (ball.y > paddleCenter + 10) {
        rightPaddleY += 5;
    }
    // Clamp paddle within canvas
    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY > canvas.height - paddleHeight) rightPaddleY = canvas.height - paddleHeight;
}

function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top/bottom)
    if (ball.y - ballRadius < 0 || ball.y + ballRadius > canvas.height) {
        ball.vy *= -1;
    }

    // Paddle collisions
    // Left paddle
    if (collision(0, leftPaddleY)) {
        ball.vx *= -1.05;
        // Add a bit of randomness
        ball.vy += (Math.random() - 0.5) * 2;
        ball.x = paddleWidth + ballRadius; // Prevent sticking
    }
    // Right paddle
    if (collision(canvas.width - paddleWidth, rightPaddleY)) {
        ball.vx *= -1.05;
        ball.vy += (Math.random() - 0.5) * 2;
        ball.x = canvas.width - paddleWidth - ballRadius;
    }

    // Score check
    if (ball.x - ballRadius < 0) {
        rightScore++;
        resetBall();
    }
    if (ball.x + ballRadius > canvas.width) {
        leftScore++;
        resetBall();
    }

    // Move AI paddle
    moveRightPaddle();
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
