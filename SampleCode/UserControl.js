/*
Dinosaur Project
UserControl.js
This javascript document will hold interactive user aspects inside the site.
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

bgButton.addEventListener("click",() => {bgPopup.classList.add("open-bg-popup");});
backBg.addEventListener("click", () => {bgPopup.classList.remove("open-bg-popup");});


/* character */
const characterButton = document.getElementById("character");
const characterPopup = document.getElementById("character-popup");
const backButton = document.getElementById("backButton");

/* open and close character page */
characterButton.addEventListener("click", () => {characterPopup.classList.add("open-popup");});
backButton.addEventListener("click", () => {characterPopup.classList.remove("open-popup");})



