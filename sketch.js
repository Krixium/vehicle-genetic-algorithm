const c = {
  w: 1024,
  h: 720 
};

var meta = {
  vehicleCount: 20,
  cloneRate: 0.002,
  foodCount: 100,
  foodSpawnRate: 0.10,
  poisonCount: 20,
  poisonSpawnRate: 0.005
};

var vehicles = [];
var food = [];
var poison = [];

function setup() {
  var cnv = createCanvas(c.w, c.h);
  cnv.parent('container');

  fill(51);
  rect(0, 0, c.w, c.h);
  for (var i = 0; i < meta.vehicleCount; i++) {
    // Randomize dna here
    vehicles.push(
      new Vehicle(random(c.w), random(c.h))
    );
  }

  for (var i = 0; i < meta.foodCount; i++) {
    food.push(
      createVector(random(c.w), random(c.h))
    );
  }

  for (var i = 0; i < meta.poisonCount; i++) {
    poison.push(
      createVector(random(c.w), random(c.h))
    ); 
  }
}

function draw() {
  background(51);

  food.forEach(function(f) {
    drawVector(f, color(0, 255, 0));
  });

  poison.forEach(function(p) {
    drawVector(p, color(255, 0, 0));
  });

  vehicles.forEach(function(v) {
    v.boundaries();
    v.hunt(food, poison);
    v.update();
    v.draw();
  });

  vehicles = vehicles.filter(function(v) {
    if (v.isDead()) {
      food.push(createVector(v.pos.x, v.pos.y));
      return false;
    } else {
      return true;
    }
  });

  spawnClones();
  generateParticles();
  displayData();
}

function drawVector(v, color) {
  fill(color);
  noStroke();
  ellipse(v.x, v.y, 6, 6);
}

function generateParticles() {
  if (random(1) < meta.foodSpawnRate) {
    food.push(
      createVector(random(c.w), random(c.h))
    );
  } 

  if (random(1) < meta.poisonSpawnRate) {
    poison.push(
      createVector(random(c.w), random(c.h))
    );
  }
}

function spawnClones() {
  vehicles.forEach(function(v) {
    if (random(1) < meta.cloneRate) {
      vehicles.push(v.clone());
    }
  })
}

function displayData() {
  var log = 'Vehicles:\n';
  vehicles.forEach(function(v) {
    log += `Health: ${v.health.toFixed(2)}\n`
  });
  document.getElementById('data').innerText = log;
}