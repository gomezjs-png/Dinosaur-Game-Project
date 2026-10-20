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

/* testing */
console.log(settingsButton);

settingsButton.addEventListener("click", () => {settingsPopup.classList.add("open-settings-popup");});

closeSettings.addEventListener("click", () => {settingsPopup.classList.remove("open-settings-popup");})