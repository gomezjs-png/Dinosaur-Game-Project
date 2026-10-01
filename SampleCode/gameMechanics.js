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

let dinoWidth = 88;
let dinoHeight = 84;
let dinoX = 50;
let dinoY= boardHeight - dinoHeight;
let dinoImg;


let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus

let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus3Img;
let cactus2Img;

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

    dinoImg = new Image();
    dinoImg.src = "PNGs/steg03.png";
    dinoImg.onload = function(){
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)};

    cactus1Img = new Image();
    cactus1Img.src = "src/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "src/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "src/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1500)//1 second
    document.addEventListener("keydown", moveDino);
}




function update(){
    if(gameOver){
        return;
    }

    requestAnimationFrame(update);

    context.clearRect(0,0,board.width, board.height);

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


}



function moveDino(e){
    if(gameOver){
        return;
    }

    if((e.code =="Space" || e.code == "ArrowUp") && dino.y == dinoY){

        velocityY = -10;

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

function detectCollision(a,b){
    return a.x< b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}
