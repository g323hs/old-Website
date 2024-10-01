function mazeMakerSolver(p, sketchManager) {
  p.sketchManager = sketchManager;

  const cols = 10;
  const rows = 10;

  let w;
  let grid;
  let current;
  let stack;
  let mazeMade;
  let solution;
  let path;
  let counter;
  let passed;
  let xOffset, yOffset;
  
  //// at the top of every sketch
  p.setup = function() {
    let container = document.getElementById("mazeMakerSolver");
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    w = contentWidth / cols;
    let contentHeight = rows * w;
    let canvas = p.createCanvas(contentWidth, contentHeight);
    canvas.parent(container);
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
    grid = [];
    stack = [];
    mazeMade = false;
    solution = false;
    counter = 0;
    passed = false;

    p.background(0);
  
    // Calculate offsets for centering the maze
    let mazeWidth = cols * w;
    let mazeHeight = rows * w;
    xOffset = (p.width - mazeWidth) / 2;
    yOffset = (p.height - mazeHeight) / 2;
  
    // Store offsets in p object for use in drawing
    p.xOffset = xOffset;
    p.yOffset = yOffset;
  
    const x = (p.windowWidth - p.width) / 2 + xOffset;
    const y = (p.windowHeight - p.height) / 2 + yOffset;

    path = p.createGraphics(p.windowWidth, p.windowHeight);
    path.position(x, y);
    path.noFill();

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        grid.push(new Cell(i, j, p));
      }
    }
  
    current = grid[0];
    ///
    p.noLoop();
  }
  ////

  p.draw = function() {
    if (!mazeMade) {
      makeMaze();
    } else if (!solution) {
      complete();
      p.image(path, 0, 0);
    } else {
      p.noLoop();
    }
  };

  function complete() {
    const column = w;
    const row = w;

    if (current === grid[grid.length - 1]) {
      if (counter === stack.length) {
        solution = true;
        stack.push(grid[grid.length - 1]);
      }

      path.strokeWeight(10);
      if (counter < stack.length) {
        path.beginShape();
        for (let i = 0; i <= counter; i++) {
          path.vertex(stack[i].i * column + column / 2 + xOffset, stack[i].j * row + row / 2 + yOffset);
        }
        path.endShape();
        counter++;
      }
    } else {
      solve();
    }
  }

  function makeMaze() {
    for (const element of grid) {
      element.show(p);
    }

    current.visited = true;
    const next = current.checkNeighbors();

    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      grid[grid.length - 1].highlight('red');
      grid[0].highlight('green');
      mazeMade = true;

      if (p.floor(p.random(1, 3)) === 1) {
        removeWalls(grid[grid.length - 1], grid[grid.length - 2]); // to the left
      } else {
        removeWalls(grid[grid.length - 1], grid[grid.length - cols - 1]); // for the top
      }
      grid[grid.length - 1].show(p);
      grid[grid.length - 2].show(p);
      grid[grid.length - cols - 1].show(p);
    }
  }

  function Cell(i, j, p) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;

    this.checkNeighbors = function() {
      const neighbors = [];
      const top = grid[index(i, j - 1)];
      const right = grid[index(i + 1, j)];
      const bottom = grid[index(i, j + 1)];
      const left = grid[index(i - 1, j)];

      if (top && !top.visited) neighbors.push(top);
      if (right && !right.visited && right !== grid[grid.length - 1]) neighbors.push(right);
      if (bottom && !bottom.visited && bottom !== grid[grid.length - 1]) neighbors.push(bottom);
      if (left && !left.visited) neighbors.push(left);

      if (neighbors.length > 0) {
        const r = p.floor(p.random(0, neighbors.length));
        return neighbors[r];
      }
      return undefined;
    };

    this.highlight = function(colour) {
      p.noStroke();
      p.fill(colour);
      p.rect(this.i * w + p.xOffset, this.j * w + p.yOffset, w, w);
    };

    this.show = function() {
      const x = this.i * w + p.xOffset; // Apply xOffset for centering
      const y = this.j * w + p.yOffset; // Apply yOffset for centering
      p.stroke(0);
    
      if (this.walls[0]) p.line(x, y, x + w, y); // Top
      if (this.walls[1]) p.line(x + w, y, x + w, y + w); // Right
      if (this.walls[2]) p.line(x + w, y + w, x, y + w); // Bottom
      if (this.walls[3]) p.line(x, y + w, x, y); // Left
    
      if (this.visited) {
        p.noStroke();
        p.fill(255);
        p.rect(x, y, w, w);
      }
    };
    
  }

  function removeWalls(a, b) {
    const x = a.i - b.i;
    if (x === 1) {
      a.walls[3] = false;
      b.walls[1] = false;
    } else if (x === -1) {
      a.walls[1] = false;
      b.walls[3] = false;
    }
    const y = a.j - b.j;
    if (y === 1) {
      a.walls[0] = false;
      b.walls[2] = false;
    } else if (y === -1) {
      a.walls[2] = false;
      b.walls[0] = false;
    }
  }

  function solve() {
    if (!passed) {
      current = grid[0];
      stack = [];
      for (const element of grid) {
        element.visited = false;
      }
      passed = true;
    }

    current.visited = true;
    const next = findNeighbor(current);
    if (next) {
      next.visited = true;
      stack.push(current);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    }
  }

  function findNeighbor(current) {
    const neighbors = [];
    const i = current.i;
    const j = current.j;

    const top = grid[index(i, j - 1)];
    const right = grid[index(i + 1, j)];
    const bottom = grid[index(i, j + 1)];
    const left = grid[index(i - 1, j)];

    if (top && !top.walls[2] && !current.walls[0] && !top.visited) neighbors.push(top);
    if (right && !right.walls[3] && !current.walls[1] && !right.visited) neighbors.push(right);
    if (bottom && !bottom.walls[0] && !current.walls[2] && !bottom.visited) neighbors.push(bottom);
    if (left && !left.walls[1] && !current.walls[3] && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      const r = p.floor(p.random(0, neighbors.length));
      return neighbors[r];
    }
    return undefined;
  }

  function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
      return -1;
    }
    return i + j * cols;
  }
}
