document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let width = 10;
  let bombAmount = 20;
  let squares = [];
  let isGameOver = false;
  let flags = 0;
  let checked = 0;
  let firstTimeclick = true;

  // create the board
  const createBoard = () => {
    // get shuffled game array with  random bombs
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // normal click
      square.addEventListener("click", (e) => {
        click(square);
      });
      // cntrl and left click
      square.oncontextmenu = (e) => {
        e.preventDefault();
        addFlag(square);
      };
    }

    // Add numbers
    for (let i = 0; i < squares.length; i++) {
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      const isTopEdge = i < width;
      const isBottomEdge = i >= width * width - width;
      const right = !isRightEdge && squares[i + 1].classList.contains("bomb");
      const left = !isLeftEdge && squares[i - 1].classList.contains("bomb");
      const top = !isTopEdge && squares[i - width].classList.contains("bomb");
      const bottom =
        !isBottomEdge && squares[i + width].classList.contains("bomb");
      const northEast =
        !isRightEdge &&
        !isTopEdge &&
        squares[i + 1 - width].classList.contains("bomb");
      const northWest =
        !isLeftEdge &&
        !isTopEdge &&
        squares[i - 1 - width].classList.contains("bomb");
      const southEast =
        !isRightEdge &&
        !isBottomEdge &&
        squares[i + 1 + width].classList.contains("bomb");
      const southWest =
        !isLeftEdge &&
        !isBottomEdge &&
        squares[i - 1 + width].classList.contains("bomb");
      let total =
        right +
        left +
        top +
        bottom +
        northEast +
        northWest +
        southEast +
        southWest;
      squares[i].setAttribute("data", total);
    }
  };
  createBoard();
  // add Flag with righ click
  const addFlag = (square) => {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flags++;
        if (flags == bombAmount) checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
      }
    }
  };
  // click on square actions
  const click = (square) => {
    // if(firstTimeclick) {
    //     createBoard();
    //     firstTimeclick = false;
    // }
    let currentId = square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("flag")
    )
      return;
    if (
      square.classList.contains("bomb") ||
      checked == width * width - bombAmount - 1
    ) {
      gameOver();
    } else {
      let total = square.getAttribute("data");
      if (total != 0) {
        square.classList.add("checked");
        checked++;
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
    checked++;
  };

  //check neighbouring squares once square is clicked
  const checkSquare = (square, currentId) => {
    const i = parseInt(currentId);
    console.log(i, "check square");
    setTimeout(() => {
      if (square.getAttribute("data") == 0) {
        const left = i % width !== 0;
        const right = i % width !== width - 1;
        const top = i >= width;
        const bottom = i < width * width - width;
        if (left) click(squares[i - 1]);
        if (right) click(squares[i + 1]);
        if (top) click(squares[i - width]);
        if (bottom) click(squares[i + width]);
      }
    }, 10);
  };
  // game over
  const gameOver = (square) => {
    console.log("BOOM! Game Over!");
    isGameOver = true;
    // show All the Bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  };
  // check for win
  const checkForWin = () => {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
    }
    if (matches === bombAmount) {
      gameOver();
      console.log("YOU WIN!");
    }
  };
});
