/*
Dinosaur Project
gameMechanics.js
This javascript document will hold most of the game mechanics for our game ie. keyboard input,
obstacle mechanics, etc.
*/

// set board dimensions
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// set default dino dimensions and PNG
let dinoWidth = 174; // was 88
let dinoHeight = 170; // was 84
let dinoX = 30; // was 50
let dinoY= 120; // was boardHeight - dinoHeight;
let dinoImg;
let dinoDead;
let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// ducking animation
let dinoDuckImg;
let ducking = false;

// running animation
let runFrame = 0;
let runSpeed = 9;
let isRunning = true;
let dinoRun1;
let dinoRun2;
let stagnantDino;

//sound variables
let jumpSound;
let duckSound;
let soundOn = true;

// cactus dimensions and PNGs
let cactus1Width = 60; //was 34
let cactus2Width = 69;
let cactus3Width = 90; //was 102

let cactusHeight = 60;
let cactusX = 700;
let cactusY = 200; // was boardHeight - cactusHeight;

let cactus1Img;
let cactus3Img;
let cactus2Img;
let cactusHasPassed = false;

// Pterodactyl
let pteroClosed;
let pteroOpen;
let pteroWidth =  69;
let pteroHeight = 84;
let pteroX = boardWidth;
let pteroHeights = [25,90,120];
let pteroSpeed = -10; //How fast pterodactyl will move left
let pteroFrame = 0;

let obstacleArray = [];

// game physics
let velocityX = -8; //cactus moving left
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let frameCount = 0;

// if dinosaur changes
let dinoChoice;
// brach option
const brach = document.getElementById("brach");
brach.addEventListener("click", () => {
    dinoWidth = 154;
    dinoHeight = 150;
    dinoX = 30;
    dinoY = 90;
    dinoChoice = 2;
    //alert("Dino changed to Brachiosaurus!");
});
// back to steg option
const steg = document.getElementById("steg");
steg.addEventListener("click", () => {
    dinoWidth = 174;
    dinoHeight = 170;
    dinoX = 30;
    dinoY = 120;
    dinoChoice = 1;
    //alert("Dino changed to Stegosaurus!");
});

// load everything once opened
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d")
    // makes PNG not blurry
    context.imageSmoothingEnabled = false;

    // default stagnant dino PNG
    dinoImg = new Image();
    dinoImg.src = "PNGs/steg03.png";
    stagnantDino = new Image();
    stagnantDino.src = "PNGs/steg03.png";

    // default dino dead PNG
    dinoDead = new Image();
    dinoDead.src = "PNGs/steg03_dead.png";

    // default ducking dino PNG
    dinoDuckImg = new Image();
    dinoDuckImg.src = "PNGs/steg03_duck.png";

    // default running PNGs
    dinoRun1 = new Image();
    dinoRun2 = new Image();
    dinoRun1.src = "PNGs/steg03_move01.png";
    dinoRun2.src = "PNGs/steg03_move02.png";

    // if dinosaur is changed
    // brach
    brach.addEventListener("click", () => {
        dinoImg.src = "PNGs/brach.png";
        stagnantDino.src = "PNGs/brach.png";
        dinoDead.src = "PNGs/brach_dead.png";
        dinoDuckImg.src = "PNGs/brach_duck.png";
        dinoRun1.src = "PNGs/brach_move01.png";
        dinoRun2.src = "PNGs/brach_move02.png";
        dinoChoice = 2;
    });
    // steg
    steg.addEventListener("click", () => {
        dinoImg.src = "PNGs/steg03.png";
        stagnantDino.src = "PNGs/steg03.png";
        dinoDead.src = "PNGs/steg03_dead.png";
        dinoDuckImg.src = "PNGs/steg03_duck.png";
        dinoRun1.src = "PNGs/steg03_move01.png";
        dinoRun2.src = "PNGs/steg03_move02.png";
        dinoChoice = 1;
    })

    // cacti PNGs
    cactus1Img = new Image();
    cactus1Img.src = "PNGs/smallCactus.png";

    cactus2Img = new Image();
    cactus2Img.src = "PNGs/mediumCactus.png";

    cactus3Img = new Image();
    cactus3Img.src = "PNGs/largeCactus.png";

    //ptero PNGs
    pteroClosed = new Image();
    pteroClosed.src = "PNGs/pteroClosed.png";

    pteroOpen = new Image();
    pteroOpen.src = "PNGs/pteroOpen.png";

    // update animation based on action taken
    requestAnimationFrame(update);
    setInterval(placeObstacle, 1000)//1 second

    //listens for arrow down to change to ducking png
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keydown", duckDino);

    //listens for the arrow down key to turn back unpressed to draw stagnant dino
    document.addEventListener("keyup", drawDino);

    //if music button is clicked, play sound effects
    jumpSound = new Audio("Audio/roblox-classic-jump.mp3")
    duckSound = new Audio("Audio/roblox-classic-jump.mp3")

    document.getElementById("music").addEventListener("click", function(){
        //if clicked change boolean
        soundOn = !soundOn;
        //change text if boolean is changed
        this.textContent = soundOn ? "Music: On" : "Music: OFF";
    });

    document.getElementById("restart").addEventListener("click", function(){
        //set all game variables and arrays to 0
        gameOver = false;
        score = 0;
        dino.y = dinoY;
        velocityY = 0;
        obstacleArray = [];
        ducking = false;
        dinoImg = stagnantDino;
        frameCount = 0;
        runFrame = 0;
        isRunning = true;
        cactusHasPassed = false;

        //hide button
        this.style.display = "none";
        requestAnimationFrame(update);
    })

}

// updates score and all PNGs
function update(){


    //if game over is true draw the dead dino, score, and obstacles on the final frame
    if(gameOver){

        //clear board and draw dinoDead

        context.clearRect(0, 0, board.width, board.height);
        context.drawImage(dinoDead, dino.x, dino.y, dino.width, dino.height);

        //redraw score
        context.font = "20px Courier";
        context.fillStyle = "black";
        context.fillText(score, boardWidth - 80, 30);

        //redraw every obstacle frozen in place
        for (let obstacle of obstacleArray) {
            if (obstacle.type === "ptero") {
                //pick the wing image for the current animation frame
                let wingAnim = (Math.floor(pteroFrame / 10) % 2 === 0) ? pteroClosed : pteroOpen;

                context.drawImage(
                    wingAnim,
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height
                );
            } else {
                context.drawImage(
                    obstacle.img,
                    obstacle.x,
                    obstacle.y,
                    obstacle.width,
                    obstacle.height
                );
            }
        }

        //make the background darker
        context.fillStyle = "rgba(0,0,0,0.3)";
        context.fillRect(0, 0, board.width, board.height);

        //display GameOVer text
        context.font = "30px Courier";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.fillText("GAME OVER", boardWidth / 2, boardHeight /2);

        //show restart button
        document.getElementById("restart").style.display = "block";

        return;
    }


    requestAnimationFrame(update);

    //clear old frames
    context.clearRect(0,0,board.width, board.height);

    //adding a score count that continuously updates every 5 frames
    frameCount++;
    if (frameCount % 5 ==0){
        score++;
    }
    context.font = "20px Courier";
    context.fillStyle = "black";
    context.fillText(score, boardWidth - 80, 30);

    //dino gravity ONLY when not ducking
   if(!ducking) {
        velocityY += gravity;
        dino.y = Math.min(dino.y + velocityY, dinoY);
    } else {
        dino.y = 130;
    }

    // running animation
    if (dino.y === dinoY && isRunning) {
        // keep track of frame for switching PNG
        runFrame++;

        // alternate between the two running PNGs
        if (Math.floor(runFrame / runSpeed) % 2 === 0) {
            dinoImg = dinoRun1;
        } else {
           dinoImg = dinoRun2;
        }
    }

    // draw dinosaur
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    // reset running animation after jumping/ducking
    if (dino.y === dinoY) {
        isRunning = true;
    }

    //ptero Wing animation
    pteroFrame++

    //change between closed/open wings
    let wingAnim = (Math.floor(pteroFrame / 10) % 2 === 0) ? pteroClosed : pteroOpen;

    //move, draw, and check collisions
    for(let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i];

        if (obstacle.type === "ptero") {
            obstacle.x += pteroSpeed;   //pteros fly faster than cacti
            obstacle.img = wingAnim;   //update flapping image

        } else {
            obstacle.x += velocityX;   //cacti scroll left
        }
        //draw Obstacle
        context.drawImage(
            obstacle.img,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );

        if (detectCollision(dino, obstacle)) {
            gameOver = true;
        }
    }


}

//function draws regular dino when arrowdown is released
function drawDino(e) {
    if (e.code == 'ArrowDown' && ducking) {
        isRunning = true;     //resume running animation
        ducking = false;
        dinoImg = stagnantDino;
        dino.y = dinoY;    //go back to ground level
    }
}

// draws the dinosaur jumping when space or arrowup is pressed
function moveDino(e){
    if(gameOver){
        return;
    }


    if((e.code =="Space" || e.code == "ArrowUp") && dino.y == dinoY){

        velocityY = -12;

        //if soundOn variable is true, play audio
        if(soundOn){
            jumpSound.currentTime = 0;
            jumpSound.play();
        }

        // back to stagnant img when jumping
        isRunning = false;
        dinoImg = stagnantDino;
    }
}

// draws the dinosaur ducking when arrowdown is pressed
function duckDino(e){

    if(gameOver){
        return;
    }


    //only ducks when arrow is pressed down, and ducking isn't already true
    if (e.code == "ArrowDown" && dino.y == dinoY && !ducking) {

        //if soundOn is true, play sound when ducking
        if(soundOn){
            duckSound.currentTime = 0;
            duckSound.play();
        }

        ducking = true;
        isRunning = false;
        dinoImg = dinoDuckImg;
        dino.y = 100;

        // doesn't change?
        if (dinoChoice === 2) {
            dino.y = 50;
        }

    }

}

// draws the cacti at random intervals
function placeObstacle() {

    if (gameOver) {
        return;
    }

    //a new obstacle created right at the edge of the board
    let obstacle = {
        img: null,
        x: boardWidth,
        y: null,
        width: null,
        height: null
    };

    //only cacti spawn below score of 400
    if (score < 400) {

        let placeCactusChance = Math.random();

        if (placeCactusChance > .90) { // 10% chance of cactus3
            obstacle.img = cactus3Img;
            obstacle.width = cactus3Width;
        } else if (placeCactusChance > .70) {//30% chance to get c2
            obstacle.img = cactus2Img;
            obstacle.width = cactus2Width;

        } else if (placeCactusChance > .50) { //50% chacne to get cactus
            obstacle.img = cactus1Img;
            obstacle.width = cactus1Width;
        } else {
            return;
        }

        if (obstacleArray.length > 5) {
            obstacleArray.shift(); //removes first cactus from array
        }

        obstacle.y = cactusY;
        obstacle.height = cactusHeight;
        obstacle.type = "cactus";

    } else {
        let placePteroChance = Math.random();

        if (placePteroChance > 0.65) {       //35% chance of ptero
            obstacle.img = pteroClosed;
            obstacle.width = pteroWidth;
            obstacle.height = pteroHeight;

            //one of three flying heights at random
            obstacle.y = pteroHeights[
                Math.floor(Math.random() * pteroHeights.length)
                ];

            obstacle.type = "ptero";

        } else {    //otherwise spawn small cactus
            obstacle.img = cactus1Img;
            obstacle.width = cactus1Width;
            obstacle.height = cactusHeight;
            obstacle.y = cactusY;
            obstacle.type = "cactus";
        }
    }
    obstacleArray.push(obstacle);  //add the obstacle to the game
}

// collision detection when hitting cacti or pterodactyls
function detectCollision(a, b) {
        //add offsets to shrink the hitbox so only collides where
        //the dino body is visible

        let offsetX = 45;
        let offsetY = 40; // was 60

        /*
         if (dinoChoice === 2) {
            offsetY = 40;
        */

        return a.x + offsetX < b.x + b.width &&
            a.x + a.width - offsetX > b.x &&
            a.y + offsetY < b.y + b.height &&
            a.y + a.height - offsetY > b.y;
    }

