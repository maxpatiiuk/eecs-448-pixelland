/*
 * Configuration file for board construction
 */

// Single cell would be 3vmax in size
let cellSize = 3;
const INITIAL_CELL_SIZE = 3;
const MAX_CELL_SIZE = 6;
const MIN_CELL_SIZE = 1;
const CELL_SIZE_STEP = 1;
// An ugly hack for my IDE thinking that cellSize is not modified anywhere
void (() => (cellSize += 1));

// Lower value is faster
const MOVEMENT_SPEED = 100;

// Movement is slower when moving diagonally
const DIAGONAL_MOVEMENT_SPEED = Math.sqrt(MOVEMENT_SPEED ** 2 * 2);

const urlParameters = new URLSearchParams(window.location.search);

const DEBUG = urlParameters.has('debug');
const DEVELOPMENT = DEBUG || urlParameters.has('development');
if (DEBUG) document.body.classList.add('debug');
if (DEVELOPMENT) document.body.classList.add('development');

const MAP_TYPE = DEVELOPMENT
  ? urlParameters.get('map') ?? 'rainbowland'
  : undefined;
