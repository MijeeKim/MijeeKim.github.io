// common
const section = document.querySelector("section");
const btn_close = section.querySelectorAll(".close");
const btn_reset = section.querySelector(".reset");

btn_close.forEach((item) => item.addEventListener("click", handleClose));
btn_reset.addEventListener("click", handleReset);

function handleClose(e) {
  // console.log(e.target.parentNode.parentNode);
  e.target.parentNode.parentNode.style = "visibility: hidden";
}

function handleReset() {
  localStorage.clear();
}

// ready 버튼을 누를 때
const btn_ready = section.querySelector(".ready");
const popup_setting = section.querySelector(".settingPopup");
const nickname = section.querySelector('input[name="nickname"]');
const btn_select = section.querySelectorAll(".character");

const mine = section.querySelector(".mine");
const myName = mine.querySelector(".myName");
const myProfile = mine.querySelector(".profile img");

const cards = [
  1,
  2,
  2,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  5,
  6,
  6,
  6,
  6,
  6,
  6,
  7,
  7,
  7,
  7,
  7,
  7,
  7,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  8,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  9,
  10,
  10,
  10,
  10,
  10,
  10,
  10,
  10,
  10,
  10,
];

function shuffle() {
  for (let i = cards.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let t = cards[i];
    cards[i] = cards[j];
    cards[j] = t;
    // 피셔-예이츠 셔플(Fisher-Yates shuffle) 알고리즘은 이 중 하나입니다.
    // 피셔-예이츠 셔플 알고리즘은 배열 끝 요소부터 시작해
    // 앞으로 하나씩 나아가면서 해당 요소 앞에 있는 임의의 요소와
    // 해당 요소를 바꿔치기하는 알고리즘
  }
  localStorage.setItem("cards", JSON.stringify(cards));
}

function loadCards() {
  const loadedCards = localStorage.getItem("cards");
  if (loadedCards) {
    paintCards(loadedCards);
  }
}

let card_img = section.querySelectorAll(".card img");

function paintCards(card) {
  let card_array = JSON.parse(card).slice(0, 16);
  card_img.forEach(
    (item, i) =>
      (item.outerHTML = `<img src="./cards/${card_array[i]}.png" alt="${card_array[i]}">`)
  );
}

btn_ready.addEventListener("click", handleReady);

function handleReady(e) {
  //팝업창 열기
  popup_setting.style = "visibility: visible";
  //닉네임 입력하기
  nickname.addEventListener("change", handleNickname);
  //캐릭터 선택하기
  btn_select.forEach((item) => item.addEventListener("click", handleSelect));
  //카드 배열 섞고 저장
  shuffle();
}

function handleNickname(e) {
  //   console.log(e.target.value);
  myName.textContent = e.target.value;
  saveNickname(e.target.value);
}

function handleSelect(e) {
  if (e.target.tagName === "IMG") {
    // console.log(e.target.src);
    myProfile.src = e.target.src;
  }
  saveProfile(e.target.src);
}

function saveNickname(nick) {
  localStorage.setItem("nickname", nick);
}

function saveProfile(img) {
  localStorage.setItem("profile_img", img);
}

function loadNickname() {
  const savedNick = localStorage.getItem("nickname");
  myName.textContent = savedNick;
}

function loadProfile() {
  const savedProfile = localStorage.getItem("profile_img");
  myProfile.src = savedProfile;
}

init();
function init() {
  loadNickname();
  loadProfile();
}

//ready 버튼을 누르면,
// 모달팝업으로 게임룰에 대해 설명한다.
// 팝업 창에 있는 input창에 닉네임을 입력하고 캐릭터를 선택한다.
// localstorage에 저장한다.

// 두번째 플레이어 자리에 선택한 닉네임과 캐릭터 사진을 넣어준다.
// (class: mine)

// 이미지 폴더에 있는 카드 사진을 랜덤으로 불러와서
// 배열에 넣는다. localstorage에 저장한다.

//start버튼을 누를 때
const btn_start = section.querySelector(".start");
const card_back = section.querySelectorAll(".back");

btn_start.addEventListener("click", handleStart);
function handleStart() {
  // 카드 배열에서 불러와서 차례대로 넣기
  loadCards();
  // ready 버튼 비활성화
  btn_ready.removeEventListener("click", handleReady);
  // dealer의 첫 번째 카드 오픈
  card_back.forEach(function (item, i) {
    if (3 < i && i < 7) {
      item.addEventListener("click", handleBack);
    }
  });
}

function handleBack(e) {
  e.target.classList.add("off");
}
//start 버튼을 누르면,

// localstorage에 있는 카드 배열의 순서대로 16개의 카드를 넣어준다.

// dealer의 첫번째 카드는 자동으로 오픈되고,
// dealer의 두번째부터 네번째 카드는 각 turn이 진행되면서 차례대로 열린다.

//turn 진행조건은 모든 플레이어가 배팅을 마감했을 때이다.
// turn이 마감되면, dealer는 자신의 다음 카드를 오픈한다.
// turn이 마감되는 것은 모든 플레이어의 배팅 금액이 같아질 때

// 카드 위에 덮여있는(position) 뒷장의 모습을 클릭하면,
// z-index가 바뀌거나 opacity가 0이 되면서
// 아래에 있던 카드의 숫자면이 보인다. (mine과 dealer만 해당)
// mine에 있는 카드는 hover하면 숫자가 얕게 보인다.

const btn_betting = section.querySelector(".bettingBtn");
const popup_betting = section.querySelector(".bettingPopup");
const bettingNum = section.querySelector('input[type="number"]');

const totalNum = section.querySelector(".total");
const betting_array = [];

btn_betting.addEventListener("click", handleBetting);

function handleBetting() {
  // 베팅 팝업
  popup_betting.style = "visibility: visible";
}

btn_close[1].addEventListener("click", function () {
  // 베팅 금액을 배열로 만들고 그 배열을 누적해서 합산한 금액을 넣기
  betting_array.push(bettingNum.value);
});

console.log(betting_array);

//배팅은 모달팝업으로 띄워서 진행한다.

// 배팅 시에 call을 누르면 맨 앞 순서의 플레이어가 배팅한 금액과 같은 금액을
// 배팅 input 창에 띄운다.
// 만약 추가 배팅을 하고 싶으면, 화살표를 누른다.
// 최종 금액 input.value에서 맨 앞 플레이어가 배팅한 금액을 빼서
// ~(맨 앞플레이어의 배팅금액)받고 ~(뺀 값) 더! 를 외친다.

//배팅 확정 버튼을 누르면 다음 순서 플레이어의 배팅이 진행되며 완료된다.
// 모든 플레이어의 총 배팅 금액은 배열로 저장되고, 누적되어 reduce 표시된다.
// (각 방향에서 배팅이 완료되면 칩이 배팅판으로 흩뿌려지는 액션 4개)
