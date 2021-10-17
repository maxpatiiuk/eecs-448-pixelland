/**
 * Utility functions
 * @module Utils
 */

/**
 * Gets indexed letter
 * @function getNthLetter
 * @param index
 * @memberof Utils
 */
const getNthLetter = (index) => String.fromCharCode('A'.charCodeAt(0) + index);

/**
 * Gets element index from array
 * @function getElementIndex
 * @param element
 * @memberof Utils
 */
const getElementIndex = (element) =>
  Array.from(element.parentElement.children).indexOf(element);

/**
 * Gets ship length
 * @function shipCellCount
 * @param numberOfShip
 * @memberof Utils
 */
const shipCellCount = (numberOfShips) =>
  (numberOfShips * (numberOfShips + 1)) / 2;

/**
 * Gets surrounding neighbor cells of single cell
 * @function getNeighbourCells
 * @param row row count
 * @param col column count
 * @memberof Utils
 */
const getNeighbourCells = (row, col) => [
  [row - 1, col],
  [row, col - 1],
  [row, col + 1],
  [row + 1, col],
];

/**
 * Gets all cells on request
 * @function getAllNeighbourCells
 * @param row row count
 * @param col column count
 * @memberof Utils
 */
const getAllNeighbourCells = (row, col) => [
  [row, col - 1],
  [row, col],
  [row, col + 1],
  [row - 1, col - 1],
  [row - 1, col],
  [row - 1, col + 1],
  [row + 1, col - 1],
  [row + 1, col],
  [row + 1, col + 1],
];
