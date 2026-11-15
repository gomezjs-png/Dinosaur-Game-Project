/*
Dinosaur Project
UserControl.js
This javascript document will hold interactive user aspects inside the site.
*/
/*Database connection with the API*/
const API_Base = "http://localhost:8080";

console.log('script is running');
/*Opens popup*/
const openBtn = document.querySelector('.btn');
const blackWrapper   = document.querySelector('.black-wrapper');
const closeBtn = document.querySelector('.close');

/*test*/
console.log('script loaded');
console.log(openBtn, blackWrapper, closeBtn);

/* Openning initial popup */
openBtn.addEventListener('click', ()=>{
    console.log('button clicked');
    blackWrapper.classList.add('open');
});
closeBtn.addEventListener('click', () => {
    blackWrapper.classList.remove('open');
});


/* -------------------- */
/*Sign up and login page*/
/* -------------------- */
const signupForm   = document.getElementById("signupForm");
const signinForm   = document.getElementById("signinForm");
const popupTitle   = document.getElementById("popupTitle");
const authMessage  = document.getElementById("authMessage");

//Switching between both login and signup
function showLogIn(){
    signupForm.hidden = true;
    signinForm.hidden = false;
    popupTitle.textContent = "Welcome back! Sign in";
    showMessage("");
}
function showSignUp(){
    signupForm.hidden = false;
    signinForm.hidden = true;
    popupTitle.textContent = "Wanna Save your progress? Become a member";
    showMessage("");
}
//Having the button reaction here
document.getElementById("signInPage").addEventListener("click", showLogIn)
document.getElementById("signupPage").addEventListener("click", showSignUp)

//if any server messages show up they will show in a corresponding color
function showMessage(text, isError = false){
    authMessage.textContent = text;
    authMessage.style.color = isError ? "crimson":"green";
}

//sending the JSON to the springboot controller
async function postJson(path, body){
    try{
        const res = await fetch(API_Base + path, {
            method : "POST",
            headers: {"Content-Type":"application/json"},
            body:JSON.stringify(body)
        });
        const data = await res.json().catch(() => ({}));
        return {ok: res.ok, data};
    } catch (err){
        return {ok: false, data: {error: "Cant reach the server. Is springboot running?"}};
    }
}
//signup -> POST /api/sign up
signupForm.addEventListener("submit", async(e) =>{
    e.preventDefault();//stopping page from reloading
    const {ok, data} = await postJson("/api/signup",{
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value
    });
    if (ok){
        signupForm.reset();
        showLogIn();
        showMessage(data.message);
    }else{
        showMessage(data.error || "sign up failed.", true);
    }

});
//login -> POST /api/login
signinForm.addEventListener("submit", async(e) =>{
    e.preventDefault();
    const {ok, data} = await postJson("/api/login",{
        identifier: document.getElementById("usernameChosen").value.trim(),
        password: document.getElementById("passwordChosen").value
    });
    if (ok){
        signinForm.reset();
        showMessage(data.message);
        sessionStorage.setItem("dinoUser", data.username); //remembering the user information until tab is closed
        openBtn.textContent = "Hi "+ data.username;
        setTimeout(() => blackWrapper.classList.remove('open'), 1000);
    }else{
        showMessage(data.error || "sign in failed.", true);
    }
});
//Keeping greeting if the page is refreshed
const savedUser = sessionStorage.getItem("dinoUser");
if(savedUser){
    openBtn.textContent = "Hi " + savedUser;
}


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