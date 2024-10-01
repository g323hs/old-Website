function cellularAutomata(p, sketchManager) {
  p.sketchManager = sketchManager;

  const gridWidth = 11;
  const gridHeight = 11;

  let boxes;
  let boxesCopy;
  let cur;
  let work;
  let temp, i, j, startButton, oldTime, randomButton;
  let run;
  let boxWidth;

  //// at the top of every sketch
  p.setup = function() {
    let container = document.getElementById("cellularAutomata");
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    boxWidth = contentWidth / gridWidth;
    let contentHeight = boxWidth * gridHeight;
    let canvas = p.createCanvas(contentWidth, contentHeight);
    canvas.parent(container);
    

    createButtonUI(container);
    addCSS();

    resetSketch();
    const resetButton = p.createButton("Reset");
    resetButton.class("reset_button");
    resetButton.parent(container);
    resetButton.mousePressed(resetSketch);
    
    canvas.mousePressed(function() {
      if (p.sketchManager) {
        p.sketchManager.toggleLoop(p);
      }
    });
  };

  function resetSketch() {
    /// Unique to this sketch
    run = false;
    
    startButton.html("Start Simulation");
    
    boxes = [];
    for (i = 0; i < gridWidth; i++) {
      temp = [];
      for (j = 0; j < gridHeight; j++) {
        let boxy;
        // let boxy = new Box(i,j, random() < 0.5);
        boxy = new Box(i, j, false);
        temp.push(boxy);
      }
      boxes.push(temp);
    }

    boxesCopy = [];
    for (i = 0; i < boxes.length; i++) {
      temp = [];
      for (j = 0; j < boxes[0].length; j++) {
        let boxy = new Box(i, j, boxes[i][j].alive);
        temp.push(boxy);
      }
      boxesCopy.push(temp);
    }
    
    oldTime = Math.round(Date.now() / 1000);

    p.loop();
    ///
    
  }
  ////

  function createButtonUI(container) {
    startButton = p.createButton("Start Simulation");
    startButton.class("control_button");
    startButton.parent(container);
    startButton.mousePressed(startStop);

    randomButton = p.createButton("Random Simulation");
    randomButton.class("control_button");
    randomButton.parent(container);
    randomButton.mousePressed(randomFunc);
  }

  function randomFunc() {
    resetSketch();
    for (i = 0; i < gridWidth; i++) {
      for (j = 0; j < gridHeight; j++) {
        let bool = p.random() > 0.5;
        boxes[i][j].alive = bool;
        boxesCopy[i][j].alive = bool;
      }
    }
  }

  function startStop() {
    oldTime = Math.round(Date.now() / 1000);
    run = !run;
    startButton.html(run ? "Pause Simulation" : "Start Simulation");
  }
  
  p.mouseReleased = function() {
    let x = p.round(p.min(p.max((p.mouseX - (p.mouseX % boxWidth)) / boxWidth, 0), gridWidth - 1));
    let y = p.round(p.min(p.max((p.mouseY - (p.mouseY % boxWidth)) / boxWidth, 0), gridHeight - 1));
    
    let curBox = work[x][y];
    
    if (p.mouseX > curBox.x * boxWidth && p.mouseX < (curBox.x + 1) * boxWidth && p.mouseY > curBox.y * boxWidth && p.mouseY < (curBox.y + 1) * boxWidth) {
      curBox.alive = curBox.alive == false;
    }
  }

  class Box {
    constructor(x, y, alive) {
      this.x = x;
      this.y = y;
      this.alive = alive;
    }
  
    neighbours() {
      let count = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // if not ourselves
          if ((i == 0 && j == 0) == false) {
            let xCoord = this.x + i;
            let yCoord = this.y + j;
            if (xCoord < 0) {
              xCoord += boxes.length;
            }
            if (yCoord < 0) {
              yCoord += boxes[0].length;
            }
            if (xCoord > boxes.length - 1) {
              xCoord -= boxes.length;
            }
            if (yCoord > boxes[0].length - 1) {
              yCoord -= boxes[0].length;
            }
  
            if (boxes[xCoord][yCoord].alive) {
              count += 1;
            }
          }
        }
      }
      return count;
    }
  
    show() {
      if (p.mouseX > this.x * boxWidth && p.mouseX < (this.x + 1) * boxWidth && p.mouseY > this.y * boxWidth && p.mouseY < (this.y + 1) * boxWidth) {
        if (this.alive) { 
          p.fill(80);
        } else {
          p.fill(150);
        }
      } else if (this.alive) { 
          p.fill(0);
        } else {
          p.fill(255);
        }
      p.stroke(255,255,255);
      p.square(this.x * boxWidth, this.y * boxWidth, boxWidth);
    }
  }

  p.draw = function() {
    p.background(220);
    cur = boxes;
    work = boxesCopy;
    
    if (Math.round(Date.now() / 1000) > oldTime && run) {
      oldTime += 1;
      for (let i = 0; i < cur.length; i++) {
        for (let j = 0; j < cur[0].length; j++) {
          let n = cur[i][j].neighbours();
          if (cur[i][j].alive == true && (n < 2 || n > 3)) {
            work[i][j].alive = false;
          }
          if (cur[i][j].alive == false && n == 3) {
            work[i][j].alive = true;
          }
        }
      }
    }
    for (i = 0; i < work.length; i++) {
      for (j = 0; j < work[0].length; j++) {
        cur[i][j].alive = work[i][j].alive ;
        cur[i][j].show();
      }
    }  
  }

  function addCSS() {
    const style = document.createElement('style');
    style.innerHTML = `
      .control_button {
        width: 100%;
        padding: 10px;
        background-color: var(--reset-button-bg-color);
        color: rgb(0, 0, 0);
        border: 1px solid #000000;
        border-radius: 0;
        font-size: var(--font-size-small);
        cursor: pointer;
        text-align: center;
        display: block;
        margin: 0 auto;
      }

      .control_button:hover {
        background-color: var(--reset-button-bg-color-hover);
      }
    `;
    document.head.appendChild(style);
  }

}


// idea add graph showing percentage pop over time also if all dead pause sim





