var mutationRate = 0.01;
var mutationScale = 0.5;

function Vehicle(x, y, dna, generation) {
  this.accel = createVector(0, 0);
  this.vel = createVector(0, -2);
  this.pos = createVector(x, y);
  this.r = 4;
  this.maxSpeed = 5;
  this.maxForce = 0.5;
  
  this.health = 1;
  this.color = color(0, 255, 0);

  this.d = 50;

  if (generation === undefined) {
    this.generation = 0;
  } else {
    this.generation = generation + 1;
  }

  if (dna === undefined) {
    this.dna = [
      random(-2, 2),      // Food Weight
      random(-2, 2),      // Poison Weight
      random(0, 300),     // Food Perception
      random(0, 300)      // Poison Perception
    ];
  } else {
    this.dna = dna.map(function(n) {
      if (random(1) < mutationRate) {
        if (random(1) > 0.5) {
          return n + (n * random(mutationScale)); 
        } else {
          return n - (n * random(mutationScale));
        }
      } 

      return n;
    });
  }

  this.applyForce = function(force) {
    this.accel.add(force);
  }

  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.pos);

    desired.setMag(this.maxSpeed);

    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);

    return steer;
  }

  this.eat = function(list, nutrition, perception) {
    var record = Infinity;
    var closest = null;

    for (var i = list.length - 1; i >= 0; i--) {
      var d = this.pos.dist(list[i]);
      if (d < this.maxSpeed) {
        list.splice(i, 1);
        this.health += nutrition;
      } else {
        if (d < record && d < perception) {
          record = d;
          closest = list[i];
        }
      }
    }
    
    if (closest !== null) {
      return this.seek(closest);
    }

    return createVector(0, 0);
  }

  this.hunt = function(good, bad) {
    var steering = [
      this.eat(good, 0.2, this.dna[2]).mult(this.dna[0]),
      this.eat(bad, -0.75, this.dna[3]).mult(this.dna[1])
    ];

    steering.forEach(function(s) {
      this.applyForce(s);
    }.bind(this));
  }

  this.boundaries = function() {
    var desired = null;

    if (this.pos.x < this.d) {
      desired = createVector(this.maxSpeed, this.vel.y);
    } else if (this.pos.x > c.w - this.d) {
      desired = createVector(-this.maxSpeed, this.vel.y);
    }

    if (this.pos.y < this.d) {
      desired = createVector(this.vel.x, this.maxSpeed);
    } else if (this.pos.y > c.h - this.d) {
      desired = createVector(this.vel.x, -this.maxSpeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxSpeed);
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }

  this.update = function() {
    this.health -= 0.005;

    this.vel.add(this.accel);
    this.vel.limit(this.maxSpeed);

    this.pos.add(this.vel);

    this.accel.mult(0);
  }

  this.isDead = function() {
    return this.health < 0;
  }

  this.clone = function() {
    return new Vehicle(this.pos.x, this.pos.y, this.dna, this.generation);
  }

  this.draw = function() {
    var angle = this.vel.heading() + PI / 2;
    this.color = lerpColor(color(255, 0, 0), color(0, 255, 0), this.health);

    push();
      translate(this.pos.x, this.pos.y);
      rotate(angle);

      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(2);
      ellipse(0, 0, this.dna[2] * 2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, this.dna[3] * 2);

      fill(this.color);
      stroke(this.color);
      strokeWeight(1);
      beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
      endShape(CLOSE);
    pop();
  }

  this.log = function() {
    return `HP: ${this.health.toFixed(2)}, Generation: ${this.generation}\n`;
  }
}