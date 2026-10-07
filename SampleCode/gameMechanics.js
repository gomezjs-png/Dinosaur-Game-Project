/*
Dinosaur Project
gameMechanics.js
This javascript document will hold most of the game mechanics for our game ie. keyboard input,
obstacle mechanics, etc.
*/

//set board dimensions
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

let dinoWidth = 150; // was 88 and 174
let dinoHeight = 170; // was 84
let dinoX = 30; // was 50
let dinoY= 120; // was boardHeight - dinoHeight;
let dinoImg;

let ducking = false;


let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus

let cactusArray = [];

let cactus1Width = 24; // was 34
let cactus2Width = 50; //was 69
let cactus3Width = 80; //was 102

let cactusHeight = 60;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus3Img;
let cactus2Img;

// Pterodactyl
let pteroArray = [];
let pteroWidth =  69;
let pteroHeight = 84;
let pteroX = boardWidth;
let pteroHeights = [20,90,130];
let pteroSpeed = -10; //How fast pterodactyl will move left
let pteroFrame = 0;
let pteroStartScore = 450;

//game physics
let velocityX = -8; //cactus moving left
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

//change board dimensions
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d")
    // makes PNG not blurry
    context.imageSmoothingEnabled = false;

    dinoImg = new Image();
    dinoImg.src = "PNGs/steg03.png";
    dinoImg.onload = function(){
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)};

    cactus1Img = new Image();
    cactus1Img.src = "PNGs/smallCactus.png";

    cactus2Img = new Image();
    cactus2Img.src = "PNGs/mediumCactus.png";

    cactus3Img = new Image();
    cactus3Img.src = "PNGs/largeCactus.png";


    requestAnimationFrame(update);
    setInterval(placeCactus, 1500)//1 second
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keydown", duckDino, ducking = true);
    document.addEventListener("keyup", drawDino, ducking = false);


    //Spawning in the pterodactyls a couple seconds after the cacti
    pteroClosed = new Image();
    pteroClosed.src = "PNGs/pteroClosed.png";

    pteroOpen = new Image();
    pteroOpen.src = "PNGs/pteroOpen.png";
    setInterval(placePtero, 4000);
}




function update(){
    if(gameOver){
        return;
    }

    requestAnimationFrame(update);

    context.clearRect(0,0,board.width, board.height);

    //adding a score count that continuosly updates
    score++;
    context.font = "20px Courier";
    context.fillStyle = "black";
    context.fillText(score, boardWidth - 80, 30);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for(let i = 0; i < cactusArray.length; i++){
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)){
            gameOver = true;
            //draw dino dead image
        }
    }

    //Pterodactyl
    pteroFrame++;
    let wingAnim = (Math.floor(pteroFrame / 10) % 2 ==0)? pteroClosed : pteroOpen;

    for (let i=0; i< pteroArray.length; i++){
        let ptero = pteroArray[i];
        ptero.x += pteroSpeed;
        context.drawImage(wingAnim, ptero.x, ptero.y, ptero.width, ptero.height);

        if (detectCollision(dino,ptero)){
            gameOver = true;
        }
    }

    pteroArray = pteroArray.filter(p => p.x + p.width >0);
}


function drawDino(e){
    if(e.code == 'ArrowDown') {
        dinoImg = new Image();
        dinoImg.src = "PNGs/steg03.png";
        dinoImg.onload = function () {
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)
        };
    }
}



function moveDino(e){
    if(gameOver){
        return;
    }

    if((e.code =="Space" || e.code == "ArrowUp") && dino.y == dinoY){

        velocityY = -12;

    }

}

function duckDino(e){

    if(gameOver){
        return;
    }

    if(e.code =="ArrowDown" && dino.y == dinoY){
        dinoImg = new Image();
        dinoImg.src = "PNGs/steg03_duck.png";
        dinoImg.onload = function(){
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)};

    }

}



function placeCactus(){

    if(gameOver){
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if(placeCactusChance > .90){ // 10% chance of cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if(placeCactusChance > .70) {//30% chance to get c2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);

    }
    else if(placeCactusChance > .50){ //50% chacne to get cactus
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if(cactusArray.length > 5){
        cactusArray.shift(); //removes first cactus from array
    }

}

//wanting to spawn in the pterodactyls from the rh side

function placePtero(){
    //if the game has ended, or the running score has not reached a certain level.
    if (score < pteroStartScore || gameOver){
        return;
    }

    let pterodactyl = {
        img: pteroClosed,
        x:pteroX,
        y: pteroHeights[Math.floor(Math.random()*pteroHeights.length)],
        width: pteroWidth,
        height: pteroHeight
    };
    pteroArray.push(pterodactyl);

}

function detectCollision(a,b){
    return a.x< b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
