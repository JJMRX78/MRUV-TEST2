let startTime, animationFrame;
let paused = false;
let pauseTime = 0;
let lastElapsed = 0;

const car1 = document.getElementById("car1");
const car2 = document.getElementById("car2");
const tInput = document.getElementById("t");
const results = document.getElementById("results");

const scale = 5; // px por metro
const maxVisibleDistance = window.innerWidth / scale;

function startSimulation() {
  cancelAnimationFrame(animationFrame);
  car1.style.left = "0px";
  car2.style.left = "0px";
  tInput.value = "0";
  results.textContent = "";
  startTime = null;
  paused = false;
  pauseTime = 0;
  animationFrame = requestAnimationFrame(animate);
}

function animate(timestamp) {
  if (!startTime) startTime = timestamp;
  if (paused) return;

  const elapsed = (timestamp - startTime - pauseTime) / 1000;
  lastElapsed = elapsed;

  const v0_1 = parseFloat(document.getElementById("v0_1").value);
  const a_1 = parseFloat(document.getElementById("a_1").value);
  const x1 = v0_1 * elapsed + 0.5 * a_1 * elapsed ** 2;

  const v0_2 = parseFloat(document.getElementById("v0_2").value);
  const a_2 = parseFloat(document.getElementById("a_2").value);
  const x2 = v0_2 * elapsed + 0.5 * a_2 * elapsed ** 2;

  car1.style.left = `${x1 * scale}px`;
  car2.style.left = `${x2 * scale}px`;

  tInput.value = elapsed.toFixed(2);

  if (x1 < maxVisibleDistance && x2 < maxVisibleDistance) {
    animationFrame = requestAnimationFrame(animate);
  } else {
    showResults(x1, x2, elapsed);
  }
}

function togglePause() {
  if (!startTime) return; // si no ha comenzado, ignorar
  paused = !paused;

  if (!paused) {
    // reanudar
    startTime += performance.now() - (startTime + lastElapsed * 1000 + pauseTime);
    animationFrame = requestAnimationFrame(animate);
  } else {
    // pausar
    pauseTime += performance.now() - (startTime + lastElapsed * 1000 + pauseTime);
  }
}

function resetSimulation() {
  cancelAnimationFrame(animationFrame);
  car1.style.left = "0px";
  car2.style.left = "0px";
  tInput.value = "0";
  results.textContent = "";
  paused = false;
  pauseTime = 0;
}

function showResults(x1, x2, time) {
  results.innerHTML = `
    <p>🚗 Auto 1 recorrió <strong>${x1.toFixed(2)} m</strong> en ${time.toFixed(2)} s</p>
    <p>🚙 Auto 2 recorrió <strong>${x2.toFixed(2)} m</strong> en ${time.toFixed(2)} s</p>
  `;
}
