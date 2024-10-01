const sketchManager = new SketchManager();

const perlin1dInstance = new p5((p) => perlin1d(p, sketchManager), 'perlin1d');
const perlin2dInstance = new p5((p) => perlin2d(p, sketchManager), 'perlin2d');
const perlinWorldInstance = new p5((p) => perlinWorld(p, sketchManager), 'perlinWorld');
const mazeMakerSolverInstance = new p5((p) => mazeMakerSolver(p, sketchManager), 'mazeMakerSolver');
const recursiveTreeInstance = new p5((p) => recursiveTree(p, sketchManager), 'recursiveTree');
const cellularAutomataInstance = new p5((p) => cellularAutomata(p, sketchManager), 'cellularAutomata');
const pathFindingInstance = new p5((p) => pathFinding(p, sketchManager), 'pathFinding');
const marchingSquaresInstance = new p5((p) => marchingSquares(p, sketchManager), 'marchingSquares');
