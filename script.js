// 1. Get elements from the HTML
const truck = document.getElementById('truck');
const coin = document.getElementById('coin');
const scoreDisplay = document.getElementById('score');
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const sky = document.getElementById('sky');
const platform = document.querySelector('.platform');

// 2. Game Variables
let score = 0;
let truckPos = 150;
let coinPos = { x: 100, y: 0 };
const truckSpeed = 5;
const coinSpeed = 3;
let gameActive = true; // This will track if the game is still playing

let moveLeftInterval = null;
let moveRightInterval = null;

// 3. Create the Trophy
const trophy = document.createElement('div');
trophy.classList.add('trophy');
trophy.innerText = '🏆';
platform.appendChild(trophy); // Put the trophy on the platform


// 4. Truck Movement Logic
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


// 5. Coin Logic
function dropNewCoin() {
    let skyWidth = sky.clientWidth;
    let randomX = Math.floor(Math.random() * (skyWidth - 40));
    
    coinPos.x = randomX;
    coinPos.y = 0;
    
    coin.style.left = coinPos.x + 'px';
    coin.style.top = coinPos.y + 'px';
}

// 6. Collision Detection
function checkCollision() {
    let truckRect = truck.getBoundingClientRect();
    let coinRect = coin.getBoundingClientRect();

    if (!(coinRect.right < truckRect.left || 
          coinRect.left > truckRect.right || 
          coinRect.bottom < truckRect.top || 
          coinRect.top > truckRect.bottom)) {
        
        score++;
        scoreDisplay.innerText = score;
        
        // CHECK FOR THE WIN CONDITION!
        if (score === 50) {
            winGame();
        } else {
            dropNewCoin();
        }
    }
}

// 7. Win Game Function
function winGame() {
    gameActive = false; // Stops the game loop
    coin.style.display = 'none'; // Hide the coin
    trophy.style.display = 'block'; // Show the trophy!
    
    // Stop the truck from moving
    stopMovingLeft();
    stopMovingRight();
}

// 8. Main Game Loop
function gameLoop() {
    // Only run the game if gameActive is true
    if (gameActive) {
        coinPos.y += coinSpeed;
        coin.style.top = coinPos.y + 'px';

        if (coinPos.y > sky.clientHeight) {
            dropNewCoin();
        }

        checkCollision();
    }

    requestAnimationFrame(gameLoop);
}

// 9. Start the Game
dropNewCoin();
gameLoop();
