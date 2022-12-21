let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");

let time = 0,
  velocity = 0.1,
  velocityTarget = 0.2,
  width,
  height,
  lastX,
  lastY;

let MAX_OFFSET = 350;
let SPACING = 5;
let POINTS = MAX_OFFSET / SPACING;
let PEAK = MAX_OFFSET * 0.5;
let POINTS_PER_LAP = 6;
let SHADOW_STRENGTH = 8;

setup();

function setup() {
  resize();
  step();

  window.addEventListener("resize", resize);
  window.addEventListener("mousedown", onMouseDown);
  document.addEventListener("touchstart", onTouchStart);
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function step() {
  time += velocity;
  velocity += (velocityTarget - velocity) * 0.3;

  clear();
  render();

  requestAnimationFrame(step);
}

function clear() {
  context.clearRect(0, 0, width, height);
}

function render() {
  let x,
    y,
    cx = width / 2,
    cy = height / 2;

  context.globalCompositeOperation = "lighter";
  context.strokeStyle = "#fff";
  context.shadowColor = "#fff";
  context.lineWidth = 2;
  context.beginPath();

  for (let i = POINTS; i > 0; i--) {
    let value = i * SPACING + (time % SPACING);

    let ax = Math.sin(value / POINTS_PER_LAP) * Math.PI,
      ay = Math.cos(value / POINTS_PER_LAP) * Math.PI;

    (x = ax * value), (y = ay * value * 0.35);

    let o = 1 - Math.min(value, PEAK) / PEAK;

    y -= Math.pow(o, 2) * 200;
    y += (200 * value) / MAX_OFFSET;
    y += (x / cx) * width * 0.1;

    context.globalAlpha = 1 - value / MAX_OFFSET;
    context.shadowBlur = SHADOW_STRENGTH * o;

    context.lineTo(cx + x, cy + y);
    context.stroke();

    context.beginPath();
    context.moveTo(cx + x, cy + y);
  }

  context.lineTo(cx, cy - 200);
  context.lineTo(cx, 0);
  context.stroke();
}

function onMouseDown(event) {
  lastX = event.clientX;
  lastY = event.clientY;

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

function onMouseMove(event) {
  let vx = (event.clientX - lastX) / 100;
  let vy = (event.clientY - lastY) / 100;

  if (event.clientY < height / 2) vx *= -1;
  if (event.clientX > width / 2) vy *= -1;

  velocityTarget = vx + vy;

  lastX = event.clientX;
  lastY = event.clientY;
}

function onMouseUp(event) {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

function onTouchStart(event) {
  event.preventDefault();

  lastX = event.touches[0].clientX;
  lastY = event.touches[0].clientY;

  document.addEventListener("touchmove", onTouchMove);
  document.addEventListener("touchend", onTouchEnd);
}

function onTouchMove(event) {
  let vx = (event.touches[0].clientX - lastX) / 100;
  let vy = (event.touches[0].clientY - lastY) / 100;

  if (event.touches[0].clientY < height / 2) vx *= -1;
  if (event.touches[0].clientX > width / 2) vy *= -1;

  velocityTarget = vx + vy;

  lastX = event.touches[0].clientX;
  lastY = event.touches[0].clientY;
}

function onTouchEnd(event) {
  document.removeEventListener("touchmove", onTouchMove);
  document.removeEventListener("touchend", onTouchEnd);
}
