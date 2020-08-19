const header = document.querySelector("header"),
  header_date = header.querySelector(".header__date"),
  header_clock = header.querySelector(".header__clock");

function getTime() {
  let date = new Date();
  let dateObj = {
    year: date.getFullYear(),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(date),
    day: date.getDate(),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
      date
    ),
    hour: date.getHours(),
    min: date.getMinutes(),
    second: date.getSeconds(),
  };
  paintTime(dateObj);
}

function paintTime({ year, month, day, weekday, hour, min, second }) {
  header_date.innerText = `${year} ${month} ${day}, ${weekday}`;
  var clockText;

  if (0 <= hour && hour < 13) {
    clockText = `AM ${hour < 10 ? `0${hour}` : `${hour}`}:${
      min < 10 ? `0${min}` : `${min}`
    }:${second < 10 ? `0${second}` : `${second}`}`;
  } else {
    clockText = `PM ${hour - 12 < 10 ? `0${hour - 12}` : `${hour - 12}`}:${
      min < 10 ? `0${min}` : `${min}`
    }:${second < 10 ? `0${second}` : `${second}`}`;
  }
  header_clock.innerText = clockText;
}

const main = document.querySelector("main"),
  main_window = main.querySelector(".main__window"),
  main_todo = main.querySelector(".main__todo"),
  form = main.querySelector("form"),
  input = main.querySelector("input"),
  pendingList = main_todo.querySelector(".pending"),
  finishedList = main_todo.querySelector(".finished");

let pendingArr = [];
let finishedArr = [];

form.addEventListener("submit", handleSubmit);
function handleSubmit(e) {
  e.preventDefault();
  //   console.log(input.value.length);
  let textLength = input.value.length;

  if (0 < textLength && textLength <= 14) {
    paintPending(input.value);
    input.value = "";
  } else {
    alert("1글자 이상 14글자 이하로 입력해주세요");
  }
}
const resetBtn = document.querySelector(".resetBtn");

input.addEventListener("input", updateValue);
function updateValue() {
  //   console.log(input.value);

  if (input.value) {
    resetBtn.style = "opacity: 1";
    resetBtn.addEventListener("click", function () {
      resetBtn.style = "opacity: 0";
      input.value = "";
    });
  } else {
    resetBtn.style = "opacity: 0";
  }
}

// 1글자라도 입력하면 reset 버튼이 생성되어 보이고
// 14글자가 넘게 입력하면 경고 메세지와 reset 버튼이 보이고
// 14글자 이상 입력되면 입력하지 못하도록 하기
// li를 10개 이상 못만들게 하기

// 미디어쿼리로 화면이 줄어들거나 모바일에서 열면
// window 부분이 위로 작게 보이게(보이는 부분을 작게)
// 투두리스트 부분을 밑으로 main의 display를 바꾸기

function loadTodo() {
  const LS_pendingTodo = localStorage.getItem("pending");
  if (LS_pendingTodo !== null) {
    JSON.parse(LS_pendingTodo).forEach((todo) => {
      paintPending(todo.text);
    });
  }
}

function loadFinishedTodo() {
  const LS_finishedTodo = localStorage.getItem("finished");
  if (LS_finishedTodo !== null) {
    JSON.parse(LS_finishedTodo).forEach((toDo) => {
      paintFinished(toDo.text);
    });
  }
}

function paintPending(text) {
  const new_li = document.createElement("li");
  new_li.classList.add("todo__list");
  pendingList.appendChild(new_li);
  const new_span = document.createElement("span");
  new_span.innerHTML = text;
  new_li.appendChild(new_span);
  const del_btn = document.createElement("button");
  del_btn.innerHTML = `del`;
  del_btn.className = "deleteBtn";
  new_li.appendChild(del_btn);
  del_btn.addEventListener("click", delWork);
  const pass_btn = document.createElement("button");
  pass_btn.innerHTML = `fin`;
  pass_btn.className = "passBtn";
  new_li.appendChild(pass_btn);
  pass_btn.addEventListener("click", passWork);
  new_li.id = pendingArr.length + 1;
  const todoOBJ = {
    id: new_li.id,
    text: text,
  };
  pendingArr.push(todoOBJ);
  saveTodo();
}

function paintFinished(text) {
  const new_li = document.createElement("li");
  new_li.classList.add("todo__list");
  finishedList.appendChild(new_li);
  const new_span = document.createElement("span");
  new_span.innerHTML = text;
  new_li.appendChild(new_span);
  const del_btn = document.createElement("button");
  del_btn.innerHTML = `del`;
  del_btn.className = "deleteBtn";
  new_li.appendChild(del_btn);
  del_btn.addEventListener("click", delWork);
  const return_btn = document.createElement("button");
  return_btn.innerHTML = `re`;
  return_btn.className = "returnBtn";
  new_li.appendChild(return_btn);
  return_btn.addEventListener("click", returnWork);
  new_li.id = finishedArr.length + 1;
  const todoOBJ = {
    id: new_li.id,
    text: text,
  };
  finishedArr.push(todoOBJ);
  saveFinishedTodo();
}

function delWork(e) {
  const btn = e.target;
  const thatLi = btn.parentNode;
  const thatLi_Ul = thatLi.parentNode;

  thatLi_Ul.removeChild(thatLi);

  if (thatLi_Ul.classList.contains("pending")) {
    const cleanPending = pendingArr.filter(function (todo) {
      return todo.id !== thatLi.id;
    });
    pendingArr = cleanPending;
    saveTodo();
  }
  if (thatLi_Ul.classList.contains("finished")) {
    const cleanFinished = finishedArr.filter(function (toDo) {
      return toDo.id !== thatLi.id;
    });
    finishedArr = cleanFinished;
    saveFinishedTodo();
  }
}

function passWork(e) {
  delWork(e);
  const thatLi = e.target.parentNode;
  const thatLi_text = thatLi.children[0].innerHTML;
  paintFinished(thatLi_text);
}

function returnWork(e) {
  delWork(e);
  const thatLi = e.target.parentNode;
  const thatLi_text = thatLi.children[0].innerHTML;
  paintPending(thatLi_text);
}

function saveTodo() {
  localStorage.setItem("pending", JSON.stringify(pendingArr));
}
function saveFinishedTodo() {
  localStorage.setItem("finished", JSON.stringify(finishedArr));
}

init();
function init() {
  setInterval(getTime, 1000);
  loadTodo();
  loadFinishedTodo();
}
