const form = document.querySelector('.js-form'),
    input = form.querySelector('input'),
    greeting = document.querySelector('.js-greetings');

const USER_LS = 'currentUser',
    SHOWING_CN = 'showing';


let ment = ['Good to see you!', 'Welcome Back!', 'Gorgeous Day!', 'Happy Day!'];
const RANDOM_NUMBER = ment.length;

function saveName (text){
    localStorage.setItem(USER_LS, text)
}

function handleSubmit(event){
    event.preventDefault();
    const currentValue = input.value;
    paintGreeting(currentValue);
    saveName(currentValue);
}
function askForName(){
    form.classList.add(SHOWING_CN);
    form.addEventListener('submit', handleSubmit);
}

function paintGreeting(text){
    const number = Math.floor(Math.random()*RANDOM_NUMBER);
    // console.log(ment[number]);
    form.classList.remove(SHOWING_CN);
    greeting.classList.add(SHOWING_CN);
    greeting.innerText = `${ment[number]} ${text}♥`;
}


function loadName (){
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null){
        askForName();
    } else {
        paintGreeting(currentUser);
    }
}


function init() {
    loadName ();
}

init();