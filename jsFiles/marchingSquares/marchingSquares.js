function marchingSquares(p, sketchManager) {
  p.sketchManager = sketchManager;

  let cols = 100;
  let rows = 100;
  let grid;
  let width;
  let a;

  //// at the top of every sketch
  p.setup = function() {
    let container = document.getElementById("marchingSquares");
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    let contentHeight = p.min(contentWidth, 600);
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
    width = p.width / cols;
    grid = [];
    p.frameRate(20);
    a = p.random()*100;
    updateGrid();
    p.loop();
    ///
    p.noLoop();
  }
  ////

  function updateGrid() {
    let xoff = 0;
    for (let i = 0; i < cols + 1; i += 1) {
      grid[i] = [];
      let yoff = 0;
      for (let j = 0; j < rows + 1; j += 1) {
        let noise = p.noise(xoff + a, yoff + a, 0)
        grid[i][j] = (noise > 0.35? 1:0)
        yoff += 0.01 * width;
      }
      xoff += 0.01 * width;
    }
    a += 0.01 * width;
  }

  function drawLine(sideA, sideB) {
    p.stroke("yellow");
    p.strokeWeight(7);
    p.line(sideA[0], sideA[1], sideB[0], sideB[1]);
  }

  function drawPoly(points) {
    p.beginShape();
    for (let element of points) {
      p.vertex(element[0], element[1]);
    }
    p.endShape(p.CLOSE);
  }

  p.draw = function() {
    p.background(100); 
    updateGrid();

    // Draw lines
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        let points = [grid[j][i], 
                      grid[j][i+1], 
                      grid[j+1][i+1], 
                      grid[j+1][i]];

        let num = points[3] * 8 + points[2] * 4 + points[1] * 2 + points[0];
        let x = i * width;
        let y = j * width;
        let side1 = [x + width/2, y          ];
        let side2 = [x + width,   y + width/2];
        let side3 = [x + width/2, y + width  ];
        let side4 = [x,           y + width/2 ];
        
        let coords = [[x, y], [x + width, y],  [x + width, y + width], [x, y + width]];
        
        p.noStroke();
        switch(num) {
          case 0:
            p.fill("green");
            drawPoly(coords);
          break;
          case 1:
            p.fill("blue");
            drawPoly([coords[0], side1, side4]);
            p.fill("green");
            drawPoly([side1, coords[1], coords[2], coords[3], side4]);
            drawLine(side1, side4);
          break;
          case 2:
            p.fill("blue");
            drawPoly([side1, coords[1], side2]);
            p.fill("green");
            drawPoly([coords[0], side1, side2, coords[2], coords[3]]);
            drawLine(side1, side2);
          break;
          case 3:
            p.fill("blue");
            drawPoly([coords[0], coords[1], side2, side4]);
            p.fill("green");
            drawPoly([side2, coords[2], coords[3], side4]);
            drawLine(side2, side4);
          break;
          case 4:
            p.fill("blue");
            drawPoly([side2, coords[2], side3]);
            p.fill("green");
            drawPoly([coords[0], coords[1], side2, side3, coords[3]]);
            drawLine(side2, side3);
          break;
          case 5:
            p.fill("blue");
            drawPoly([side4, coords[0], side1]);
            drawPoly([side2, coords[2], side3]);
            p.fill("green");
            drawPoly([side1, coords[1], side2, side3, coords[3], side4]);
            drawLine(side2, side3);
            drawLine(side1, side4);
          break;
          case 6:
            p.fill("blue");
            drawPoly([side1, coords[1], coords[2], side3]);
            p.fill("green");
            drawPoly([coords[0], side1, side3, coords[3]]);
            drawLine(side1, side3);
          break;
          case 7:
            p.fill("blue");
            drawPoly([coords[0], coords[1], coords[2], side3, side4]);
            p.fill("green");
            drawPoly([side3, coords[3], side4]);
            drawLine(side3, side4);
          break;
          case 8:
            p.fill("blue");
            drawPoly([side3, coords[3], side4]);
            p.fill("green");
            drawPoly([coords[0], coords[1], coords[2], side3, side4]);
            drawLine(side3, side4);
          break;
          case 9:
            p.fill("blue");
            drawPoly([coords[0], side1, side3, coords[3]]);
            p.fill("green");
            drawPoly([side1, coords[1], coords[2], side3]);
            drawLine(side1, side3);
          break;
          case 10:
            p.fill("blue");
            drawPoly([side1, coords[1], side2]);
            drawPoly([side3, coords[3], side4]);
            p.fill("green");
            drawPoly([coords[0], side1, side2, coords[2], side3, side4]);
            drawLine(side1, side2);
            drawLine(side3, side4)
          break;
          case 11:
            p.fill("blue");
            drawPoly([coords[0], coords[1], side2, side3, coords[3]]);
            p.fill("green");
            drawPoly([side2, coords[2], side3]);
            drawLine(side2, side3);
          break;
          case 12:
            p.fill("blue");
            drawPoly([side2, coords[2], coords[3], side4]);
            p.fill("green");
            drawPoly([coords[0], coords[1], side2, side4]);
            drawLine(side2, side4);
          break;
          case 13:
            p.fill("blue");
            drawPoly([coords[0], side1, side2, coords[2], coords[3]]);
            p.fill("green");
            drawPoly([side1, coords[1], side2]);
            drawLine(side1, side2);
          break;
          case 14:
            p.fill("blue");
            drawPoly([side1, coords[1], coords[2], coords[3], side4]);
            p.fill("green");
            drawPoly([coords[0], side1, side4]);
            drawLine(side1, side4);
          break;
          case 15:
            p.fill("blue");
            drawPoly(coords);
          break;
        }
      }
    }
  };  
}


// add different effects like land and sea, change num cols as user inp try marching cubes then rotating around the object