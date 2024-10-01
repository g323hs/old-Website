function pathFinding(p, sketchManager) {
  p.sketchManager = sketchManager;

  const container = document.getElementById("pathFinding");
  const maxHeight = 600;

  let nodesX;
  let nodesY;
  let probOfConn;
  let probOfNode;
  let nGrades;
  let boxWidth;
  let nodess;
  let pacman;
  let start;
  let end;
  let pathfindingArray;
  let grid;
  let solvedText;

  //// at the top of every sketch
  p.setup = function () {
    getUserInputs();
    
    lengths = makeCanvas()
    let canvas = p.createCanvas(lengths[0], lengths[1]);
    canvas.parent(container);

    createButtonUI();
    p.frameRate(5);
    addCSS();

    resetSketch();

    let resetButton = p.createButton("Reset");
    resetButton.class("reset_button");
    resetButton.parent(container);
    resetButton.mousePressed(resetSketch);

    canvas.mousePressed(function () {
      if (p.sketchManager) {
        p.sketchManager.toggleLoop(p);
      }
    });
  };

  function resetSketch() {
    /// Unique to this sketch
    getUserInputs();
    setupgrid();

    lengths = makeCanvas();
    p.resizeCanvas(lengths[0], lengths[1], false);

    solvedText.html("Run Simulation to see if theres a solution.");
    document.getElementById("output_text_pathfinding").style.backgroundColor = "grey";
    ///
    p.noLoop();
  }
  //// 

  function makeCanvas() {
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    boxWidth = contentWidth / (nodesX + 1);
    let contentHeight = (nodesY + 1) * boxWidth;

    return [contentWidth, contentHeight];
  }

  function getUserInputs(){
    nodesX = parseFloat(document.getElementById("pathFindingX").value);
    nodesY = parseFloat(document.getElementById("pathFindingY").value);
    probOfNode = parseFloat(document.getElementById("pathFindingProbNode").value);
    probOfConn = parseFloat(document.getElementById("pathFindingProbConn").value);
    nGrades = parseFloat(document.getElementById("pathFindingNGrades").value);
  }

  function createButtonUI(container) {
    solvedText = p.createDiv("Run Simulation to see if theres a solution.");
    solvedText.id("output_text_pathfinding")
    solvedText.parent(container);
  }

  function addCSS() {
    let style = document.createElement('style');
    style.innerHTML = `
      #output_text_pathfinding {
        padding: 10px;
        background-color: var(--reset-button-bg-color);
        color: rgb(0, 0, 0);
        border: 1px solid #000000;
        border-radius: 0;
        font-size: var(--font-size-small);
        text-align: center;
        display: block;
        margin: 0 0 5px 0;
      }
    `;
    document.head.appendChild(style);
  }

  function setupgrid() {
    p.colorMode(p.HSB, 100);
    
    grid = [];
    nodess = [];
    
    for (let y = 0; y < nodesY; y += 1) {
      grid[y] = [];
        for (let i = 0; i < nodesX; i += 1) {
      
        if (p.random(1) > probOfNode) {
          grid[y][i] = 0;
        } else {
          grid[y][i] = 1;
          nodess.push(p.createVector(i, y));
        }
      }
    }
    if(nodess.length == 0) { 
      x = Math.floor(p.random(0, nodesX));
      y = Math.floor(p.random(0, nodesY));
      nodess.push(p.createVector(x,y));
      grid[y][x] = 1;
    }

    if (nodess.length == 1) {
      x = Math.floor(p.random(0, nodesX));
      y = Math.floor(p.random(0, nodesY));

      while (nodess[0].x == x && nodess[0].y == y) {
      
        x = Math.floor(p.random(0, nodesX));
        y = Math.floor(p.random(0, nodesY));
      }
      
      nodess.push(p.createVector(x,y));
      grid[y][x] = 1;
    } 
    
    
    start = Math.floor(p.random(0, nodess.length));
    end = Math.floor(p.random(0, nodess.length));
    
    while (end == start) {
      end = Math.floor(p.random(0, nodess.length));
    }

    pacman = GPS();

    pathfindingArray = [];

    for (let {} of nodess) {
      pathfindingArray.push(new Array(nodess.length * nGrades, null, false));
    }

    pathfindingArray[start][0] = 0;
  }

  function coordstonumber(X, Y) {
    for (let y = 0; y < nodess.length; y += 1) {
      if (nodess[y].x == X && nodess[y].y == Y) {
        return y;
      }
    }
    return null;
  }

  function GPS() {
    let M = nodess.length;
    let W = [];
    for (let A = 0; A < M; A += 1) {
      W[A] = [];
      for (let I = 0; I < M; I += 1) {
        W[A][I] = 0;
      }
    }

    for (let X = 0; X < M; X += 1) {
      let ad = nodess[X];
      let neighbourhood = neighbourtracker(ad.x, ad.y);
      for (let element of neighbourhood) {
        if (p.random(1) < probOfConn) {
          let H = Math.floor(p.random(1, nGrades + 1));
          let Y = coordstonumber(element[0], element[1]);
          W[X][Y] = H;
          W[Y][X] = H;
        }
      }
    }
    return W;
  }

  function neighbourtracker(i, y) {
    let right = 1;
    let down = 1;
    let neighbour = [];

    // right
    let found = false;
    while (i + right != nodesX && !found) {
      if (grid[y][i + right] != 0) {
        neighbour.push([i + right, y]);
        found = true;
      }
      right += 1;
    }

    // down
    found = false;
    while (y + down != nodesY && !found) {
      if (grid[y + down][i] != 0) {
        neighbour.push([i, y + down]);
        found = true;
      }
      down += 1;
    }
    return neighbour;
  }

  function drawgrid() {
    for (let i = 0; i < nodess.length; i += 1) {
      for (let y = 0; y < nodess.length; y += 1) {
        if (pacman[i][y] != 0) {
          p.stroke(p.map(-pacman[i][y], -nGrades, -1, 0, 30), 100, 100);
          p.strokeWeight(2.5);
          p.line(
            (nodess[i].x + 1) * boxWidth,
            (nodess[i].y + 1) * boxWidth,
            (nodess[y].x + 1) * boxWidth,
            (nodess[y].y + 1) * boxWidth
          );
        }
      }
    }
    p.textAlign(p.CENTER, p.CENTER); // Center text alignment
    p.textSize(14); // Set text size

    for (let i = 0; i < nodesX; i += 1) {
      for (let y = 0; y < nodesY; y += 1) {
        if (grid[y][i] != 0) {
          let textFill = 0;
          if (coordstonumber(i, y) == start) {
            p.fill(30, 70, 100);
          } else if (coordstonumber(i, y) == end) {
            p.fill(0, 100, 100);
          } else {
            textFill = 255;
            p.fill(0, 0, 0);
          }
          p.stroke(0, 0, 0);
          p.strokeWeight(2);
          
          // Draw larger circle
          p.circle((i + 1) * boxWidth, (y + 1) * boxWidth, 30);

          // Draw node number inside the circle
          p.fill(textFill); // Set fill color to white for text visibility
          p.noStroke();
          let nodeNumber = coordstonumber(i, y);
          p.text(nodeNumber + 1, (i + 1) * boxWidth, (y + 1) * boxWidth + 1);
        }
      }
    }
  }

  function drawKey() {
    
  }

  function minPathNode() {
    let minIndex = 0;
    while (pathfindingArray[minIndex][2] == true && minIndex < pathfindingArray.length - 1) {
      minIndex += 1;
    }
    for (let i = 0; i < pathfindingArray.length; i++) {
      if (pathfindingArray[i][0] < pathfindingArray[minIndex][0] && pathfindingArray[i][2] == false) {
        minIndex = i;
      }
    }
    if (pathfindingArray[minIndex][0] == nodess.length * nGrades) {
      minIndex = null;
    }
    return minIndex;
  }

  function neighbourtrackerFULL(i, y) {
    let right = 1;
    let left = 1;
    let up = 1;
    let down = 1;
    let neighbour = [];

    // right
    let found = false;
    while (i + right != nodesX && !found) {
      if (grid[y][i + right] == 1) {
        neighbour.push([i + right, y]);
        found = true;
      }
      right += 1;
    }

    // down
    found = false;
    while (y + down != nodesY && !found) {
      if (grid[y + down][i] == 1) {
        neighbour.push([i, y + down]);
        found = true;
      }
      down += 1;
    }

    // left
    found = false;
    while (i - left != -1 && !found) {
      if (grid[y][i - left] == 1) {
        neighbour.push([i - left, y]);
        found = true;
      }
      left += 1;
    }

    // up
    found = false;
    while (y - up != -1 && !found) {
      if (grid[y - up][i] == 1) {
        neighbour.push([i, y - up]);
        found = true;
      }
      up += 1;
    }

    return neighbour;
  }

  function labyrinth() {
    let currentNode = minPathNode();
    if (pathfindingArray[end][2] == false && currentNode != null) {
      let neighbours = neighbourtrackerFULL(nodess[currentNode].x, nodess[currentNode].y);
      for (let element of neighbours) {
        let neighbourNum = coordstonumber(element[0], element[1]);
        // if there is a path and they dont 'happen' to be next to each other
        // and it isn't a visited node
        if (pacman[neighbourNum][currentNode] != 0 && pathfindingArray[neighbourNum][2] == false) {
          // if new found path is less than the current one
          if (pathfindingArray[neighbourNum][0] > pacman[neighbourNum][currentNode] + pathfindingArray[currentNode][0]) {
            // one off for first time nodes
            if (pathfindingArray[neighbourNum][0] == nodess.length * nGrades) {
              pathfindingArray[neighbourNum][0] = 0;
            }
            //
            pathfindingArray[neighbourNum][0] = pacman[neighbourNum][currentNode] + pathfindingArray[currentNode][0];
            pathfindingArray[neighbourNum][1] = currentNode;
          }
        }
      }
      pathfindingArray[currentNode][2] = true;
    } else {
      p.noLoop();
      if (pathfindingArray[end][2] == false) {
        solvedText.html("No Solution");
        document.getElementById("output_text_pathfinding").style.backgroundColor = "red";
      } else {
        finalPath();
      }
    }
  }

  function finalPath() {
    let traceNode = end;
    let path = new Array();
    path.push(end);
    while (pathfindingArray[traceNode][1] != null) {
      traceNode = pathfindingArray[traceNode][1];
      path.push(traceNode);
    }
    path = path.reverse();
    let solved_text = "Solution: " + path.map(node => node + 1).join(" → ") + "<br>Length: " + p.str(pathfindingArray[end][0]);
    solvedText.html(solved_text);
    document.getElementById("output_text_pathfinding").style.backgroundColor = "green";
    for (let i = 0; i < path.length - 1; i++) {
      p.stroke(70, 100, 100);
      p.strokeWeight(15);
      p.line(
        (nodess[path[i]].x + 1) * boxWidth,
        (nodess[path[i]].y + 1) * boxWidth,
        (nodess[path[i + 1]].x + 1) * boxWidth,
        (nodess[path[i + 1]].y + 1) * boxWidth
      );
    }
  }

  function drawPath() {
    for (let i = 0; i < pathfindingArray.length; i++) {
      let x, y;
      if (pathfindingArray[i][2] == true) {
        x = nodess[i].x;
        y = nodess[i].y;
        p.strokeWeight(2);
        p.stroke(75, 100, 100);
        p.fill(75, 100, 100);

        p.circle((x + 1) * boxWidth, (y + 1) * boxWidth, 40);
      } else if (pathfindingArray[i][0] < nodess.length * nGrades) {
        x = nodess[i].x;
        y = nodess[i].y;
        p.strokeWeight(2);
        p.stroke(80, 50, 100);
        p.fill(80, 50, 100);

        p.circle((x + 1) * boxWidth, (y + 1) * boxWidth, 40);
      }
    }
  }

  p.draw = function () {
    p.background(220);
    labyrinth();
    drawPath();
    drawgrid();
  };
}


// idea give a 'key' for the line colour and its weight 