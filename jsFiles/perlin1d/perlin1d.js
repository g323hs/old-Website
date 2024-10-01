function perlin1d(p, sketchManager) {
  p.sketchManager = sketchManager;

  let time, start;

  //// at the top of every sketch
  p.setup = function() {
    let container = document.getElementById("perlin1d");
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
    start = p.random(0, 500);
    time = 0;
    p.loop();
    ///
    p.noLoop();
  }
  ////

  p.draw = function() {
    p.background(0); 
    let off = 0;
    for (let x = 0; x < p.width; x++) {
      let y = p.map(p.noise(start + off + time), 0, 1, 0, p.height);
      p.strokeWeight(0.2);
      p.ellipse(x, y, 10);
      off += 0.01;
    }  
    time += 0.01;
  };  
}
