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

//change board dimensions
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
}
