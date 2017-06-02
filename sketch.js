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

var setup = () => {
  var cnv = createCanvas(c.w, c.h);
  cnv.parent('container');

  fill(51);
  rect(0, 0, c.w, c.h);
  for (var i = 0; i < meta.vehicleCount; i++) {
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

var draw = () => {
  background(51);

  food.forEach(function(f) {
    drawVector(f, color(0, 255, 0));
  });

  poison.forEach(function(p) {
    drawVector(p, color(255, 0, 0));
  });

  vehicles.forEach((veh, idx, arr) => {
    veh.boundaries();
    veh.hunt(food, poison);
    veh.update();
    veh.draw();

    if (veh.isDead()) {
      food.push(
        createVector(veh.pos.x, veh.pos.y)
      );
      arr.splice(idx, 1);
    } 
  });
  
  spawnClones();
  generateParticles();
  displayData();
}

var drawVector = (v, color) => {
  fill(color);
  noStroke();
  ellipse(v.x, v.y, 6, 6);
}

var generateParticles = () => {
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

var spawnClones = () => {
  vehicles.forEach((v) => {
    if (random(1) < meta.cloneRate) {
      vehicles.push(v.clone());
    }
  })
}

var displayData = () => {
  var log = 'Vehicles:\n';
  vehicles.forEach((v) => {
    log += v.log();
  });
  document.getElementById('data').innerText = log;
}