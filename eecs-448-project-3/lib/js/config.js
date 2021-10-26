/*
 * Configuration file for board construction
 */

// Single cell would be 3vmax in size
const CELL_SIZE = 0.03;

// Lower value is faster
const MOVEMENT_SPEED = 200;

// Movement is slower when moving diagonally
const DIAGONAL_MOVEMENT_SPEED = Math.sqrt(MOVEMENT_SPEED ** 2 * 2);

const urlParameters = new URLSearchParams(window.location.search);

const DEBUG = urlParameters.has('debug');
const DEVELOPMENT = DEBUG || urlParameters.has('development');
if (DEBUG) document.body.classList.add('debug');
if (DEVELOPMENT) document.body.classList.add('development');
