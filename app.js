const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelector('.controls i');

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
    snakeY = 5;
let velocityX = 0,
    velocityY = 0;
let snakeBody = [];
let setintervalID;
let score = 0;

// get high score from local storage 
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
// pass a random between 1 and 30 as food position 
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setintervalID);
    alert('Game Over! Press OK TO REPLAY...');
    location.reload();
}

//change velocity based on key press 
const changeDirection = e => {
    if (e.key === 'ArrowUp' && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != -1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// change velocity based on click 
controls.forEach(button => button.addEventListener('click', () => changeDirection({
    key: button.dataset.key
})));
const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // when snake aet foods
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); //add food to snake body 
        score++;
        highScore = score >= highScore ? score : highScore; // if score > high score => high score = score 
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `Score: ${highScore}`;
    }
    // update Snake head 
    snakeX += velocityX;
    snakeY += velocityY;

    // Shifting forward value of element 
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]


    //check snake body is out of wall or not 

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true
    }
    // add div foe each part of snake body 
    for (let i = 0 ; i < snakeBody.length; i++){
        html += `<div class="head style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //check snake head hit or not 
    
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[1][0]) {
        gameOver = true
    }
    }
    playBoard.innerHTML = html ;
}
updateFoodPosition();
setintervalID = setInterval(initGame, 100);
document.addEventListener('keyup', changeDirection);