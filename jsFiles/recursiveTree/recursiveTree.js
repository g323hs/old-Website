function recursiveTree(p, sketchManager) {
  p.sketchManager = sketchManager;

  let theta;
  let inc;
  let x_centre;
  let y_centre;
  let first = true;

  //// at the top of every sketch
  p.setup = function() {
    let container = document.getElementById("recursiveTree");
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
    inc = 0;
    
    if (first) {first = !first} else {inc -= 1;}
    
    x_centre = p.width;
    y_centre = p.height;
    p.loop();
    
    ///
    p.noLoop();
    p.background(0);
  }
  ////

  p.draw = function() {
    
    p.background(0);
    p.stroke(255);
    
    let a = (inc /500) * 360;
    
    theta = p.radians(a);
    p.translate(x_centre/2,y_centre/1.1);
    p.line(0,0,0,-(y_centre/4));
    p.translate(0,-(y_centre/4));
    branch(y_centre/10);
    
    inc += 1;
  }
  
  function branch(h) {
    h *= 0.75;
  
    if (h > 2) {
      p.push();    
      p.rotate(theta);
      p.line(0, 0, 0, -h);
      p.translate(0, -h);
      branch(h);      
      p.pop();     
  
      p.push();
      p.rotate(-theta);
      p.line(0, 0, 0, -h);
      p.translate(0, -h);
      branch(h);
      p.pop();
    }
  }
}