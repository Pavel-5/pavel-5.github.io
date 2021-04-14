let param = document.querySelector(".parameters"); //Параметры

let m = document.querySelector("[name=m]"); //Масса груза
let k = document.querySelector("[name=k]"); //Жесткость пружины
let x0 = document.querySelector("[name=x0]"); //Начальное положение груза

let mv = document.querySelector("[name=mv]"); //Вывод значения массы
let kv = document.querySelector("[name=kv]"); //Вывод значения жесткости пружины
let x0v = document.querySelector("[name=x0v]"); //Вывод значения начального положения груза

let spec_w = document.querySelector(".specification__w"); //Харакатеристика цикличной частоты
let spec_t = document.querySelector(".specification__t"); //Харакатеристика времени
let spec_n = document.querySelector(".specification__n"); //Харакатеристика количества полных колебаний
let spec_x = document.querySelector(".specification__x"); //Харакатеристика координаты X

let button = document.querySelector(".play");

param.addEventListener("input", (e) => {
  e.stopPropagation();

  if (e.target === m) mv.value = m.value;
  if (e.target === k) kv.value = k.value;
  if (e.target === x0) x0v.value = x0.value;

  clear();
});

param.addEventListener("click", (e) => {
  e.stopPropagation();

  if (e.target.classList.contains("play")) {
    if (e.target.textContent === "Stop") {
      cancelAnimationFrame(indexReqAnimFr);
      stopTime = new Date();
      e.target.textContent = "Continue";
    } else start();
  }
  if (e.target.classList.contains("clear")) {
    clear();
  }
});

let mainCanvas = document.querySelector("#canvas");
let mainContext = mainCanvas.getContext("2d");
let canvasWidth = mainCanvas.width; //Ширина холста
let canvasHeight = mainCanvas.height; //Высота холста

let defaultLengthSpring = 100; // Длина пружины в состоянии равновесия
let lengthSpring = defaultLengthSpring + Number(x0.value); //Длина пружины

let indexReqAnimFr = null; //Индекс, возвращаемый функцией requestAnimationFrame

let startTime = null; //Время старта анимации
let stopTime = null; //Время остановки системы
let timeInterval = 0; //Интервал времени, показывающий сколько секунд система была остановлена

//Отрисовка системы
function draw() {
  //Очистка холста
  mainContext.clearRect(0, 0, canvasWidth, canvasHeight);

  let middleWidth = Math.round(canvasWidth / 2); //Середина холста по горизонтали

  //Отрисовка пружины
  mainContext.moveTo(middleWidth, 0);
  mainContext.lineTo(middleWidth, 10);

  let countBends = 15; //Количество изгибов пружины

  for (let i = 1; i <= countBends; i++) {
    if (i === countBends)
      mainContext.lineTo(middleWidth, 10 + i * (lengthSpring / countBends));
    else if (i % 2 === 0)
      mainContext.lineTo(
        middleWidth - 40,
        10 + i * (lengthSpring / countBends)
      );
    else
      mainContext.lineTo(
        middleWidth + 40,
        10 + i * (lengthSpring / countBends)
      );
  }

  mainContext.lineTo(middleWidth, lengthSpring + 20);
  mainContext.stroke();

  //Отрисовка груза
  mainContext.beginPath();

  let radius = 15 * Math.cbrt(m.value);
  mainContext.arc(
    middleWidth,
    lengthSpring + 20 + radius,
    radius,
    0,
    Math.PI * 2,
    false
  );

  mainContext.closePath();
  mainContext.stroke();

  indexReqAnimFr = requestAnimationFrame(draw);
}

//Анимация
function redraw() {
  if (!startTime) startTime = new Date();

  let { x, w, t, N } = getParameters();

  lengthSpring = defaultLengthSpring + x;

  spec_w.textContent = w.toFixed(3);
  spec_t.textContent = t.toFixed(1);
  spec_n.textContent = Math.round(N);
  spec_x.textContent = Math.round(x);

  draw();

  indexReqAnimFr = requestAnimationFrame(redraw);
}

//Вычисление параметров
function getParameters() {
  let w = Math.sqrt(k.value / m.value); //Циклическая частота собственных колебаний

  if (stopTime) timeInterval += (new Date() - stopTime) / 1000;

  let t = (new Date() - startTime) / 1000 - timeInterval; //Время колебаний (в секундах)

  let T = (2 * Math.PI) / w; //Период колебаний

  let N = x0.value != 0 ? t / T : 0; //Число полных колебаний

  let x = x0.value * Math.cos(w * t); //Координата

  return { x, w, t, N };
}

//Очистка
function clear() {
  cancelAnimationFrame(indexReqAnimFr);

  lengthSpring = defaultLengthSpring + Number(x0.value);
  startTime = null;
  stopTime = null;
  timeInterval = 0;

  spec_w.textContent = 0;
  spec_t.textContent = 0;
  spec_n.textContent = 0;
  spec_x.textContent = x0.value;
  button.textContent = "Play";

  draw();
}

//Запустить анимацию
function start() {
  cancelAnimationFrame(indexReqAnimFr);

  redraw();

  stopTime = null;

  button.textContent = "Stop";
}

draw();
