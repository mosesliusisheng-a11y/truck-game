// 1. Get elements from the HTML
const truck = document.getElementById('truck');
const coin = document.getElementById('coin');
const scoreDisplay = document.getElementById('score');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const sky = document.getElementById('sky');

// 2. Game Variables
let score = 0;
let truckPos = 150; // Truck's horizontal position
let coinPos = { x: 100, y: 0 }; // Coin's X and Y position
const truckSpeed = 5; // How fast the truck moves
const coinSpeed = 3; // How fast the coin falls

let moveLeftInterval = null;
let moveRightInterval = null;

// 3. Truck Movement Logic (Tap or Long Press)
function startMovingLeft() {
    if (moveLeftInterval === null) {
        moveLeftInterval = setInterval(() => {
            if (truckPos > 0) truckPos -= truckSpeed;
            truck.style.left = truckPos + 'px';
        }, 20);
    }
}

function stopMovingLeft() {
    clearInterval(moveLeftInterval);
    moveLeftInterval = null;
}

function startMovingRight() {
    if (moveRightInterval === null) {
        moveRightInterval = setInterval(() => {
            // 550 is roughly the right edge limit so it doesn't go off screen
            if (truckPos < 550) truckPos += truckSpeed;
            truck.style.left = truckPos + 'px';
        }, 20);
    }
}

function stopMovingRight() {
    clearInterval(moveRightInterval);
    moveRightInterval = null;
}

// Mouse and Touch events for L button
btnLeft.addEventListener('mousedown', startMovingLeft);
btnLeft.addEventListener('mouseup', stopMovingLeft);
btnLeft.addEventListener('mouseleave', stopMovingLeft);
btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); startMovingLeft(); });
btnLeft.addEventListener('touchend', stopMovingLeft);

// Mouse and Touch events for R button
btnRight.addEventListener('mousedown', startMovingRight);
btnRight.addEventListener('mouseup', stopMovingRight);
btnRight.addEventListener('mouseleave', stopMovingRight);
btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); startMovingRight(); });
btnRight.addEventListener('touchend', stopMovingRight);


// 4. Coin Logic
function dropNewCoin() {
    // Calculate a random horizontal position based on screen width
    let skyWidth = sky.clientWidth;
    let randomX = Math.floor(Math.random() * (skyWidth - 40)); // -40 to keep it on screen
    
    coinPos.x = randomX;
    coinPos.y = 0; // Start at the top of the sky
    
    coin.style.left = coinPos.x + 'px';
    coin.style.top = coinPos.y + 'px';
}

// 5. Collision Detection (Is the truck touching the coin?)
function checkCollision() {
    // Get the exact size and position of the truck and coin on the screen
    let truckRect = truck.getBoundingClientRect();
    let coinRect = coin.getBoundingClientRect();

    // Standard math to check if two boxes overlap
    if (!(coinRect.right < truckRect.left || 
          coinRect.left > truckRect.right || 
          coinRect.bottom < truckRect.top || 
          coinRect.top > truckRect.bottom)) {
        
        // They are touching!
        score++;
        scoreDisplay.innerText = score;
        dropNewCoin(); // Make a new coin fall
    }
}

// 6. Main Game Loop (Runs continuously to move coin and check for collisions)
function gameLoop() {
    // Move coin down
    coinPos.y += coinSpeed;
    coin.style.top = coinPos.y + 'px';

    // If coin falls past the truck, just drop a new one (no penalty in this version)
    if (coinPos.y > sky.clientHeight) {
        dropNewCoin();
    }

    // Check if the truck caught the coin
    checkCollision();

    // Repeat the loop
    requestAnimationFrame(gameLoop);
}

// 7. Start the Game
dropNewCoin();
gameLoop();
