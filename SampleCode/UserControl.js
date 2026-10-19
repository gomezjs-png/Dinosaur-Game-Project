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