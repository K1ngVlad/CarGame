console.log('Код "car" запущен');

const container = createDiv('main-container', [
  createDiv('id-0', [
    createDiv('id-2', []),
    createDiv('id-4', []),
    createDiv('id-2', []),
  ]),
  createDiv('id-1', [
    createDiv('id-2', []),
    createDiv('id-3', [createCanvas('game', 1024, 832)]),
    createDiv('id-2', []),
  ]),
  createDiv('id-0', [
    createDiv('id-2', []),
    createDiv('id-4', [
      createDiv('score', [createText('text-score', 'Score:')]),
      createDiv('lvl', [createText('text-lvl', 'Level:')]),
    ]),
    createDiv('id-2', []),
  ]),
]);
document.body.appendChild(container);

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const map = [];

for (let x = 0; x < 16; x++) {
  const arr = [];
  for (let y = 0; y < 25; y++) {
    arr.push({ x: x * 64, y: y * 64 - 64 * 12 });
  }
  map.push(arr);
}

// ctx.fillRect(25, 25, 100, 100);
// addWeb(map);

let speedX = 0;
let speedY = 0;
let score = 0;
let lvl = 1;
let speed = 3;

class Object {
  constructor(name, place) {
    this.name = name;
    this.place = JSON.parse(JSON.stringify(place));
  }

  add() {
    this.place.forEach((e) => {
      // console.log(e);
      ctx.fillRect(e.x, e.y, 64, 64);
    });
  }

  remove() {
    this.place.forEach((e) => {
      // console.log(e);
      ctx.clearRect(e.x, e.y, 64, 64);
    });
  }
}

class Player extends Object {
  constructor(name, place) {
    super(name, place);
  }
  change() {
    this.place.forEach((e) => {
      // console.log(e);
      e.x += speedX;
      e.y += speedY;
    });
  }
}

class Car extends Object {
  constructor(name, place) {
    super(name, place);
  }
  change() {
    this.place.forEach((e) => {
      // console.log(e);
      // e.x += speedX;
      // console.log(speed);
      e.y += speed;
    });
  }

  replace() {
    let x = ranNum(13);
    this.place = JSON.parse(
      JSON.stringify([
        map[x][8],
        map[x + 2][8],
        map[x + 1][9],
        map[x + 1][10],
        map[x][10],
        map[x + 2][10],
        map[x + 1][11],
      ])
    );
  }
}

function ranNum(x) {
  return Math.round(Math.random() * x);
}

// const copyMap = map.slice();
let test = new Player('Player', [
  map[6][24],
  map[8][24],
  map[7][23],
  map[7][22],
  map[6][22],
  map[8][22],
  map[7][21],
]);

let x = ranNum(13);

let firstCar = new Car('firstCar', [
  map[x][9],
  map[x + 2][9],
  map[x + 1][10],
  map[x + 1][11],
  map[x][11],
  map[x + 2][11],
  map[x + 1][12],
]);

let x1 = ranNum(13);

let secondCar = new Car('firstCar', [
  map[x1][0],
  map[x1 + 2][0],
  map[x1 + 1][1],
  map[x1 + 1][2],
  map[x1][2],
  map[x1 + 2][2],
  map[x1 + 1][3],
]);

let left = keyboard('ArrowLeft'),
  up = keyboard('ArrowUp'),
  right = keyboard('ArrowRight'),
  down = keyboard('ArrowDown'),
  space = keyboard(' ');

left.press = () => {
  speedX = -10;
  speedY = 0;
};

left.release = () => {
  if (!right.isDown && speedY === 0) {
    speedX = 0;
  }
};

//Up
up.press = () => {
  speedY = -10;
  speedX = 0;
};
up.release = () => {
  if (!down.isDown && speedX === 0) {
    speedY = 0;
  }
};

right.press = () => {
  speedX = 10;
  speedY = 0;
};
right.release = () => {
  if (!left.isDown && speedY === 0) {
    speedX = 0;
  }
};

down.press = () => {
  speedY = 10;
  speedX = 0;
};
down.release = () => {
  if (!up.isDown && speedX === 0) {
    speedY = 0;
  }
};

let stop = false;

addTable('Самые лучшие машинки в мире!', 'НАЧАТЬ');

space.release = () => {
  if (stop) {
    removeTable();
  } else {
    addTable('Вы поставили игру на паузу', 'Продолжить?');
  }
};

function move() {
  console.log(speed);
  if (stop) return;

  document.querySelector('.text-score').textContent = 'Score:' + score;
  document.querySelector('.text-lvl').textContent = 'Level:' + lvl;

  if (test.place[1].x >= 1024 - 64 && speedX > 0) {
    speedX = 0;
  }

  if (test.place[0].x <= 0 && speedX < 0) {
    speedX = 0;
  }

  if (test.place[0].y >= 832 - 64 && speedY > 0) {
    speedY = 0;
  }

  if (test.place[6].y <= 0 && speedY < 0) {
    speedY = 0;
  }

  test.remove();
  firstCar.remove();
  secondCar.remove();

  test.change();
  firstCar.change();
  secondCar.change();

  if (firstCar.place[0].y >= 832 + 64) {
    score++;
    console.log(score);
    firstCar.replace();

    if (!(score % 5)) lvlUp();
  }

  if (secondCar.place[0].y >= 832 + 64) {
    score++;
    console.log(score);
    secondCar.replace();
    if (!(score % 5)) lvlUp();
  }

  test.add();
  firstCar.add();
  secondCar.add();

  if (getCrash(test, [firstCar, secondCar])) {
    addTable('Вы проиграли!', 'Начать заного?');
    test.remove();
    firstCar.remove();
    secondCar.remove();

    score = 0;
    lvl = 1;
    speed = 3;

    test = new Player('Player', [
      map[6][24],
      map[8][24],
      map[7][23],
      map[7][22],
      map[6][22],
      map[8][22],
      map[7][21],
    ]);

    let x = ranNum(13);

    firstCar = new Car('firstCar', [
      map[x][9],
      map[x + 2][9],
      map[x + 1][10],
      map[x + 1][11],
      map[x][11],
      map[x + 2][11],
      map[x + 1][12],
    ]);

    let x1 = ranNum(13);

    secondCar = new Car('firstCar', [
      map[x1][0],
      map[x1 + 2][0],
      map[x1 + 1][1],
      map[x1 + 1][2],
      map[x1][2],
      map[x1 + 2][2],
      map[x1 + 1][3],
    ]);
  }

  // stop = getCrash(test, [firstCar, secondCar]);

  requestAnimationFrame(move);
}

function lvlUp() {
  'новый уровень!';
  lvl++;
  speed++;
}

function getCrash(obj, arr) {
  let crash = false;

  arr.forEach((e) => {
    if (crash) return;
    obj.place.forEach((obj1) => {
      if (crash) return;
      e.place.forEach((obj2) => {
        if (crash) return;
        let xTrue = obj1.x > obj2.x - 64 && obj1.x < obj2.x + 64;
        let yTrue = obj1.y > obj2.y - 64 && obj1.y < obj2.y + 64;
        crash = xTrue && yTrue;
      });
    });
  });

  return crash;
}

// test.remove();

// ctx.restore();

function addTable(text, text1) {
  stop = true;

  const table = document.createElement('div');
  const p = document.createElement('p');
  const btn = document.createElement('button');

  table.classList.add('table');
  p.classList.add('table-text');
  btn.classList.add('table-btn');

  p.textContent = text;
  btn.textContent = text1;

  btn.addEventListener('click', removeTable);

  table.appendChild(p);
  table.appendChild(btn);

  document.body.appendChild(table);
}

function removeTable() {
  stop = false;

  document.body.removeChild(document.querySelector('.table'));

  move();
}

function addWeb(map) {
  map.forEach((e) => {
    e.forEach((e) => {
      // console.log(e);
      ctx.strokeRect(e.x, e.y, 64, 64);
    });
  });
}

// ctx.fillRect(map[7][12].x, map[7][12].y, 64, 64);
// ctx.fillRect(map[9][12].x, map[9][12].y, 64, 64);
// ctx.fillRect(map[8][11].x, map[8][11].y, 64, 64);
// ctx.fillRect(map[8][10].x, map[8][10].y, 64, 64);
// ctx.fillRect(map[9][10].x, map[9][10].y, 64, 64);
// ctx.fillRect(map[7][10].x, map[7][10].y, 64, 64);
// ctx.fillRect(map[8][9].x, map[8][9].y, 64, 64);

function createDiv(id, elems) {
  const div = document.createElement('div');

  div.classList.add('container');
  div.setAttribute('id', id);
  elems.forEach((e) => div.appendChild(e));

  return div;
}

function createText(textClass, text) {
  const p = document.createElement('p');

  p.classList.add(textClass);
  p.textContent = text;

  return p;
}

function createCanvas(id, width, height) {
  const canvas = document.createElement('canvas');

  canvas.setAttribute('id', id);
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  return canvas;
}

//Функция регистрирования событий клавиатуры
function keyboard(value) {
  //Создание объекта для регестрирования событий клавиатуры
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //Клавиша нажата
  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //Клавиша отпущена
  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Создание регистрации события
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  //Присоединение события
  window.addEventListener('keydown', downListener, false);
  window.addEventListener('keyup', upListener, false);

  //Отсоединение события
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener);
    window.removeEventListener('keyup', upListener);
  };

  return key;
}
