let grid;
let cols;
let rows;

let isPlaying = false;
let resolution = 10;
rule = 'B3/S23';
let rulePreset = 'conway';

// Create a mapping between rule preset names and rule strings
let rulePresets = {
  "conway": "B3/S23",
  "highlife": "B36/S23"
};

let birthConditions = [];
let survivalConditions = [];



function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('canvas');
  cols = width / resolution;
  rows = height / resolution;
  rule = 'B3/S23';
  parseRule(rule);

  grid = createGrid(rows, cols);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid[i][j] = floor(random(2));
    }
  }

  select('#play-pause').mousePressed(() => {
    isPlaying = !isPlaying;
    
    // Update the button text depending on whether the simulation is playing
    select('#play-pause').html(isPlaying ? 'Pause' : 'Play');
  });

  select('#next').mousePressed(() => {
    nextStep();
  });  

  select('#clear').mousePressed(() => {
    // Clear the grid
    grid = createGrid(rows, cols);
  });

  select('#randomize').mousePressed(() => {
    // Randomize the grid
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = floor(random(2));
      }
    }
  });

  select('#resolution-select').changed(() => {
    resolution = int(select('#resolution-select').value());
    cols = width / resolution;
    rows = height / resolution;
    grid = createGrid(rows, cols);
    
    // Randomize the grid
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = floor(random(2));
      }
    }
  });

  select('#rule-input').input(() => {
    parseRule(select('#rule-input').value());
  });  

  select('#rule-select').changed(() => {
    let rulePreset = select('#rule-select').value();
  
    // Look up the rule string for the selected preset
    let ruleStr = rulePresets[rulePreset];
    if (!ruleStr) {
      console.error(`Unknown rule preset: ${rulePreset}`);
      return;
    }
  
    // Update the rule input box to reflect the selected preset
    select('#rule-input').value(ruleStr);
  
    // Parse the rule string and update the simulation
    parseRule(ruleStr);
  });
}


function draw() {
  background(0);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = j * resolution;
      let y = i * resolution;
      if (grid[i][j] == 1) {
        fill(255);
        stroke(0);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }

  if (isPlaying) {
    nextStep();
  }
}



//////////////// nextStep() ////////////////

function nextStep() {
  let next = createGrid(rows, cols);

  // Compute next generation
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let state = grid[i][j];
      let neighbors = countLiveNeighbors(grid, i, j);

      if (state == 0 && birthConditions.includes(neighbors)) {
        next[i][j] = 1;
      } else if (state == 1 && survivalConditions.includes(neighbors)) {
        next[i][j] = 1;
      } else {
        next[i][j] = 0;
      }
    }
  }

  grid = next;
}


//////////////// Helpers ///////////////////

function parseRule(ruleStr) {
  let parts = ruleStr.toUpperCase().split("/");
  if (parts.length != 2) {
    console.error("Invalid rule format. Expected format is B/S (e.g., B3/S23).");
    return;
  }

  // Parse the birth and survival conditions
  birthConditions = parts[0].substring(1).split('').map(Number);
  survivalConditions = parts[1].substring(1).split('').map(Number);
}

function createGrid(rows, cols) {
  let arr = new Array(rows);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(cols).fill(0);
  }
  return arr;
}

function countLiveNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = ((x + i + cols) % cols + cols) % cols;
      let row = ((y + j + rows) % rows + rows) % rows;      
      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}


