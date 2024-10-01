function perlin2d(p, sketchManager) {
  p.sketchManager = sketchManager;

  const xPixels = 20;
  const yPixels = 20;

  let pixelWidth;
  let a;

  //// at the top of every sketch
  p.setup = function() {
    let container = document.getElementById("perlin2d");
    let style = getComputedStyle(container);
    let contentWidth = container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    pixelWidth = contentWidth / xPixels;
    let contentHeight = yPixels * pixelWidth;
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
    p.pixelDensity(1);
    p.frameRate(10);
    a = 0;
    p.loop();
    ///
    p.noLoop();
  }
  ////

  p.draw = function() {
    p.background(0);
    let xoff = 0;
    for (let x = 0; x < p.width; x += pixelWidth) {
      let yoff = 0;
      for (let y = 0; y < p.height; y += pixelWidth) {
        let num = p.map(p.noise(xoff, yoff, a), 0, 1, 0, 255);
        p.fill(num); // Set fill color based on Perlin noise value
        p.noStroke(); // No outline for the rectangle
        p.rect(x, y, pixelWidth, pixelWidth); // Draw a rectangle representing the pixel block
        yoff += 0.01 * pixelWidth;
      }
      xoff += 0.01 * pixelWidth;
    }
    a += 0.1;
  };
}
