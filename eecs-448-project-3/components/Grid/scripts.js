/*
 * The name of this view
 * Later, to render this view, call:
 * New Grid(options).render(this.container)
 */
/**
 * Draw current player / NPC
 * @class Grid
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class Grid extends Component {
  #person;

  #destructorCalled = false;

  #previousFrameTimestamp;

  #cellSize;

  #context;

  // Real player coordinates
  #coordinates = [0, 0];

  /*
   * While walking between cells, this.#animationCoordinates
   * are smoothly transitioning between the previous and the new
   * this.#coorindates values
   *
   */
  #animationCoordinates = [0, 0];

  constructor(options) {
    super({ ...options, hasContainer: false });
  }

  /**
   * @async
   * @function render
   * @memberof Person
   * @param container Container to render the view within
   */
  async render() {
    await super.render();

    console.log(this.options.canvas);
    this.#context = this.options.canvas.getContext('2d');

    this.draw(0);
    return this;
  }

  drawCell(rowIndex, columnIndex, firstCellCoordinates) {
    const x = columnIndex * this.#cellSize + firstCellCoordinates[0];
    const y = rowIndex * this.#cellSize + firstCellCoordinates[1];

    const absoluteCoordinates = [
      this.#coordinates[0] + rowIndex,
      this.#coordinates[1] + columnIndex,
    ];

    // TODO: Implement `new Path2D()` if need to improve draw performance
    const cell = this.options.getCellAtCoordinate(...absoluteCoordinates);

    const cellPosition = [x, y, this.#cellSize, this.#cellSize];

    if (typeof cell.backgroundColor === 'string') {
      this.#context.fillStyle = cell.backgroundColor;
      this.#context.fillRect(...cellPosition);
    }

    if (typeof cell.backgroundImage === 'object')
      this.#context.drawImage(cell.backgroundImage, ...cellPosition);

    if (DEVELOPMENT)
      // Draw cell borders
      this.#context.strokeRect(x, y, this.#cellSize, this.#cellSize);

    if (DEBUG) {
      // Draw cell coordinates
      this.#context.fillStyle = '#000';
      this.#context.fillText(absoluteCoordinates.join(' '), x, y);
      this.#context.strokeText(absoluteCoordinates.join(' '), x, y);
    }
  }

  draw(timestamp) {
    /*
     * TODO: don't redraw if not needed to improve performance
     *   (if not moving, no need to redraw)
     */

    if (typeof this.#previousFrameTimestamp === 'undefined')
      this.#previousFrameTimestamp = timestamp;
    const timePassed = timestamp - this.#previousFrameTimestamp;

    this.#previousFrameTimestamp = timestamp;

    const dimensions = [this.options.canvas.width, this.options.canvas.height];

    const firstCellCoordinates = dimensions.map((size) =>
      Math.round(
        -this.#cellSize + (((size - this.#cellSize) / 2) % this.#cellSize)
      )
    );
    const cellCount = dimensions.map(
      (size) => Math.ceil(size / this.#cellSize) + 1
    );

    if (DEVELOPMENT) {
      this.#context.lineWidth = 2;
      this.#context.strokeStyle = '#fff';
    }

    if (DEBUG)
      this.#context.font = `${Math.ceil(this.#cellSize / 3)}px sans-serif`;

    Array.from({ length: cellCount[0] }, (_, columnIndex) =>
      Array.from({ length: cellCount[1] }, (_, rowIndex) =>
        this.drawCell(rowIndex, columnIndex, firstCellCoordinates)
      )
    );

    if (!this.#destructorCalled)
      window.requestAnimationFrame(this.draw.bind(this));
  }

  handleCellResize(cellSize) {
    this.#cellSize = cellSize;
  }

  handleKeyPress(pressedKeys) {
    if (DEVELOPMENT) console.log(pressedKeys);
    // TODO: listen for key movement here and change current coordinates
  }
}
