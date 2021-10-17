/*
 * Configuration file for board construction
 */

// Single cell would be 4vmax in size
const CELL_SIZE = 0.04;
const MOVEMENT_SPEED = 100;

const urlParameters = new URLSearchParams(window.location.search);

const DEBUG = urlParameters.has('debug');
const DEVELOPMENT = DEBUG || urlParameters.has('development');
if (DEBUG) document.body.classList.add('debug');
if (DEVELOPMENT) document.body.classList.add('development');
