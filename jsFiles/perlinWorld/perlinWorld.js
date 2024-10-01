function perlinWorld(p, sketchManager) {
  p.sketchManager = sketchManager;

  let sun;
  let Clouds;
  let Trees;
  let off;

  //// at the top of every sketch
  p.setup = function() {
    let container = document.getElementById("perlinWorld");
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
    Clouds = [];
    Trees = [];
    off = 0;


    // Create clouds
    for (let i = 0; i < 5; i++) {
      Clouds[i] = new Cloud(p.random(0, p.width), p.height / 10);
    }
    
    // Create sun
    sun = new Sun(p);
    
    // Create trees
    const num = 80;
    for (let i = 0; i < (p.width - p.width % num) / num; i++) {
      let x = p.random(0, p.width / ((p.width - p.width % num) / num)) + p.width / ((p.width - p.width % num) / num) * i;
      let y = p.random(p.height * 0.65, p.height * 0.62) * 0.95;
      let h = p.random(p.height / 15 * 0.8, p.height / 15 * 1.1);
      Trees[i] = new Tree(x, y, h);
    }
    p.loop();
    ///
    p.noLoop();
  }
  ////

  p.draw = function() {
    p.background(0, 200, 255);

    for (let i = 0; i < p.width; i++) {
      scene(i);
    }

    off += 0.005;
    p.stroke(250, 215, 30);
    sun.draw();
    for (const element of Clouds) {
      element.move();
      element.draw();
    }
    for (const element of Trees) {
      // Trees[i].move(); // Uncomment if trees need to move
      element.draw();
    }
  };

  class Cloud {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.r = 5;
      this.xoff = p.random(100);
      this.yoff = p.random(100);
      this.points = [];

      let counter = 0;
      let a = 0;
      while (a < p.TWO_PI) {
        this.x += this.r * p.cos(a) * 0.9;
        this.y += this.r * p.sin(a) * 0.5;

        this.points[counter] = p.createVector(this.x, this.y, p.random(p.height * 0.02, p.height * 0.1));
        counter += 1;
        a += p.random(0.2);
      }
    }

    move() {
      for (const element of this.points) {
        element.x += p.map(p.noise(this.xoff), 0, 1, 0.5, 1);
        p.vertex(element.x, element.y);
      }

      this.xoff += 0.02;

      if (this.points[this.points.length - 1].x >= p.width) {
        for (const element of this.points) {
          element.x -= p.width;
        }
      }

    }

    draw() {
      p.fill(255);
      p.stroke(255);
      p.beginShape();
      for (let i = 0; i < this.points.length; i++) {
        let y = p.map(p.noise(this.yoff), 0, 1, -p.height * 0.05, p.height * 0.05);
        this.yoff += 0.0001;
        if (i % 2 == 0) {
          p.ellipse(this.points[i].x, this.points[i].y + y, this.points[i].z);
        }
        p.vertex(this.points[i].x, this.points[i].y + y);
      }
      p.endShape();
    }
  }

  class Sun {
    constructor() {
      this.x = p.width;
      this.y = 0;
      this.r = p.width * 0.2;
      this.off = 0;
    }
    draw() {
      p.fill(250, 215, 30);
      this.r = p.map(p.sin(this.off), -1, 1, p.min(p.width, p.height) / 5, p.min(p.width, p.height)/4);
      p.ellipse(this.x, this.y, this.r);
      this.off += 0.05;
    }
  }

  class Tree {
    constructor(x, y, h) {
      this.x = x;
      this.y = y;
      this.inc = 28;
      this.theta = p.radians((28 / 500) * 360);
      this.h = h;
      this.offset = p.random(1);
    }
  
    branch(h) {
  
      h *= p.map(p.noise(this.h*200), 0, 1, 0.6, 0.75);
      if (h < 10) {
        p.stroke(100, 140, 60);
        p.strokeWeight(3);
      }
      if (h > 2) {
        p.push();
        let vari1 = p.map(p.noise(this.h), 0, 1, this.theta * 0.6, this.theta * 2.75);
        p.rotate(vari1 + p.map(p.noise(this.offset), 0, 1, -p.PI/6, p.PI/6 ));
        p.line(0, 0, 0, -h);
        p.translate(0, -h);
        this.branch(h);
        p.pop();
  
        p.push();
        let vari2 = p.map(p.noise(this.h), 1, 0, this.theta * 0.6, this.theta * 1);
        p.rotate(-vari2 + p.map(p.noise(this.offset), 0, 1, -p.PI/6, p.PI/6 ));
        p.line(0, 0, 0, -h);
        p.translate(0, -h);
        this.branch(h);
        p.pop();
      }
      this.offset += 0.00001;
    }
    calc(x) {
      this.theta = p.radians(x / 500) * 360;
    }
    draw() {
      p.stroke(100, 70, 30);
      p.strokeWeight(2);
      p.translate(this.x, this.y);
      p.line(0, 0, 0, this.h);
      this.branch(this.h);
      p.translate(-this.x, -this.y);
      p.strokeWeight(1);
    }
  }

  function scene(i) {
    p.stroke(90); //mountains
    p.line(i, p.height, i, p.map(p.noise(i/200), 0, 1, 3 * p.height / 5, 0));
    
    p.stroke(255, 255, 100); // beach - dry
    p.line(i, p.height, i, p.map(p.noise(i / (p.width / 4)), 0, 1, 2 * p.height / 3, 3 * p.height / 5));
    
    p.stroke(153, 128, 0); // beach - wet
    p.line(i, p.height, i, p.map(p.noise(i / (p.width * 5 / 4) + off * 0.1), 0, 1, 7 * p.height / 9, 2 * p.height / 3) - p.height * 0.005);
    
    p.stroke(0, 200, 255); // sea - light blue
    p.line(i, p.height, i, p.map(p.noise(i / (p.width * 5 / 4) + off), 0, 1, 7 * p.height / 9, 2 * p.height / 3));
    
    p.stroke(0, 0, 255); // sea - blue
    p.line(i, p.height, i, p.map(p.noise(i / (p.width * 15 / 4) + off), 0, 1, 8 * p.height / 9, 7 * p.height / 9));
    
    p.stroke(100, 0, 255); // sea - dark blue
    p.line(i, p.height, i, p.map(p.noise(i / (p.width * 20 / 4) + off), 0, 1, p.height, 8 * p.height / 9));
  }
}