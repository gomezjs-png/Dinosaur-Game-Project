/*
Dinosaur Project
UserControl.js
This JavaScript document will hold interactive user aspects inside the site.
*/
console.log('script is running');
const openBtn = document.querySelector('.btn');
const blackWrapper   = document.querySelector('.black-wrapper');
const closeBtn = document.querySelector('.close');

/*test*/
console.log('script loaded');
console.log(openBtn, blackWrapper, closeBtn);


openBtn.addEventListener('click', ()=>{
    console.log('button clicked');
    blackWrapper.classList.add('open');
});
closeBtn.addEventListener('click', () => {
    blackWrapper.classList.remove('open');
});

/* ------------- */
/* settings page */
/* ------------- */

const settingsButton = document.getElementById("settings");
const settingsPopup = document.getElementById("settings-popup");
const closeSettings = document.getElementById("close");

/* open and close settings */
settingsButton.addEventListener("click", () => {settingsPopup.classList.add("open-popup");});
closeSettings.addEventListener("click", () => {settingsPopup.classList.remove("open-popup");});


/* background */
const bgButton = document.getElementById("background");
const bgPopup = document.getElementById("bg-popup");
const backBg = document.getElementById("back-bg")
const closeBg = document.getElementById("close-bg")

bgButton.addEventListener("click",() => {bgPopup.classList.add("open-bg-popup");});
backBg.addEventListener("click", () => {bgPopup.classList.remove("open-bg-popup");});
closeBg.addEventListener("click", ()=>{bgPopup.classList.remove("open-bg-popup"), settingsPopup.classList.remove("open-popup");});


/* character */
const characterButton = document.getElementById("character");
const characterPopup = document.getElementById("character-popup");
const backButton = document.getElementById("back-button");
const closeCharacter = document.getElementById("close-character");
const stegButton = document.getElementById("steg");
const brachButton = document.getElementById("brach");

/* open and close character page */
characterButton.addEventListener("click", () => {characterPopup.classList.add("open-popup");});
backButton.addEventListener("click", () => {characterPopup.classList.remove("open-popup");})
closeCharacter.addEventListener("click", () => {characterPopup.classList.remove("open-popup"); settingsPopup.classList.remove("open-popup");});

/* shows which dinosaur is selected */
stegButton.addEventListener("click", () => {stegButton.classList.add("select-dino"); brachButton.classList.remove("select-dino")});
brachButton.addEventListener("click", () => {brachButton.classList.add("select-dino"); stegButton.classList.remove("select-dino")})

