const canvas = document.getElementById("jsCanvas");
const colorPicker = document.getElementById("colorPicker");
const selectedColor = document.getElementById("jsSelectedColor");
const brushRange = document.querySelector("input[type=range]");
const selectedSize = document.getElementById("jsSelectedSize");
const btnMode = document.getElementById("btnMode");
const btnReset = document.getElementById("btnReset");
const btnSave = document.getElementById("btnSave");

const ctx = canvas.getContext("2d");
const CANVAS_SIZE = 500;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

//context default
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = "#232323";
ctx.fillStyle = "#232323";
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function onMouseMove(e) {
  const x = e.offsetX;
  const y = e.offsetY;
  if (!painting) {
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function startPainting() {
  painting = true;
}

function stopPainting() {
  painting = false;
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("click", handleFillEvent);
  canvas.addEventListener("contextmenu", handleCM);
}

colorPicker.addEventListener("change", handleColorPicker);
brushRange.addEventListener("input", handleBrushSize);
btnMode.addEventListener("click", handleModeChange);
btnReset.addEventListener("click", handleReset);
btnSave.addEventListener("click", handleSave);

function handleColorPicker(e) {
  const color = e.target.value;
  selectedColor.textContent = color;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}

function handleBrushSize(e) {
  const brushSize = e.target.value;
  selectedSize.textContent = brushSize;
  ctx.lineWidth = brushSize;
}

function handleModeChange() {
  if (!filling) {
    filling = true;
    btnMode.textContent = "paint";
  } else {
    filling = false;
    btnMode.textContent = "fill";
  }
}

function handleFillEvent() {
  if (filling === true) {
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

function handleReset() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

function handleCM(e) {
  e.preventDefault();
}

function handleSave() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "image_note";
  link.click();
}
