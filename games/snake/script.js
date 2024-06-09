let canvas = document.getElementById('board');
let ctx = canvas.getContext('2d');

const middleX = canvas.width / 2;
const middleY = canvas.height / 2;

let blocksize = 20;

let snake = {
  head: { x: middleX, y: middleY },
  body: [
    { x: middleX - blocksize, y: middleY },
    { x: middleX - 2 * blocksize, y: middleY },
    { x: middleX - 3 * blocksize, y: middleY },
  ],
  vx: blocksize,
  vy: 0,
  bodySize: 3
};

let food = {};

// --------------------------------------------------------------------------------------------------------------
// functions

// animation delay function
function sleep(milliseconds) { // use: await sleep(ms)
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// creates a random int between 0 and canvas size
function generateRandomCoordinate(min = 0, max = 19) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// creates a food element
function createFoodCoordinate() {
  food.x = generateRandomCoordinate() * blocksize;
  food.y = generateRandomCoordinate() * blocksize;

}

function drawFood() {
  ctx.fillStyle = 'purple';
  ctx.fillRect(food.x, food.y, blocksize, blocksize);
}

// returns if snake head has same position as food or not
function ate() {
  if (snake.head.x === food.x && snake.head.y === food.y) {
    return true;
  }
  return false;
}

// draw snake
function drawSnake() {
  // clean screen
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  // draw head
  ctx.fillRect(snake.head.x, snake.head.y, blocksize, blocksize);

  // draw body
  snake.body.forEach((bodyElem) => { ctx.fillRect(bodyElem.x, bodyElem.y, blocksize, blocksize) });
}

// returns if snake touched its body or not
function died() {
  // check if head has same position than any of the body segments
  for (let segment of snake.body) {
    if (snake.head.x === segment.x && snake.head.y === segment.y) {
      return true;
    }
  }
  return false;
}

// updates snake position for each body element (if ate(), snake grows one body element)
function getSnakePosition() {
  let lastPosX = snake.body[snake.bodySize - 1].x;
  let lastPosY = snake.body[snake.bodySize - 1].y;

  //body
  for (let i = snake.bodySize - 1; i > 0; i--) {
    let segment = snake.body[i];
    let nextSegment = snake.body[i - 1];
    segment.x = nextSegment.x;
    segment.y = nextSegment.y;
  }
  snake.body[0].x = snake.head.x;
  snake.body[0].y = snake.head.y;

  if (ate()) {
    snake.body.push({ x: lastPosX, y: lastPosY });
    snake.bodySize++;
    createFoodCoordinate();
  }

  // head
  snake.head.x += snake.vx;
  snake.head.y += snake.vy;

  // out of bounds?
  if (snake.head.x >= canvas.width) {
    snake.head.x = 0;
  } else if (snake.head.x < 0) {
    snake.head.x = canvas.width - blocksize;
  }

  if (snake.head.y >= canvas.height) {
    snake.head.y = 0;
  } else if (snake.head.y < 0) {
    snake.head.y = canvas.height - blocksize;
  }
}

async function main() {
  createFoodCoordinate();
  while (true) {
    drawSnake(snake);

    drawFood();

    getSnakePosition(snake);

    let clickedInThisFrame = false;
    //mudança de direção
    document.addEventListener('keydown', function(e) {
      if (!clickedInThisFrame) {
        // left
        if (e.which === 37 && snake.vx === 0) {
          snake.vx = -blocksize;
          snake.vy = 0;
        }
        // up
        else if (e.which === 38 && snake.vy === 0) {
          snake.vy = -blocksize;
          snake.vx = 0;
        }
        // right
        else if (e.which === 39 && snake.vx === 0) {
          snake.vx = blocksize;
          snake.vy = 0;
        }
        // down
        else if (e.which === 40 && snake.vy === 0) {
          snake.vy = blocksize;
          snake.vx = 0;
        }

        clickedInThisFrame = true;
      }
    });

    if (died()) {
      snake = {
        head: { x: middleX, y: middleY },
        body: [
          { x: middleX - blocksize, y: middleY },
          { x: middleX - 2 * blocksize, y: middleY },
          { x: middleX - 3 * blocksize, y: middleY },
        ],
        vx: blocksize,
        vy: 0,
        bodySize: 3
      };

      createFoodCoordinate();
    }

    await sleep(200);
  }
}

main();
