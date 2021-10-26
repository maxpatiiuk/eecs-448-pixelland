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

  #animationStart;

  #cellSize;

  #context;

  #pressedKeys = [];

  #animationDuration = [];

  // Real player coordinates
  #coordinates = [0, 0];

  /*
   * While walking between cells, this.#animationOffset
   * are smoothly transitioning between [0,0] and the movement destination
   * (e.x, [1,0] or [-1, -1])
   *
   */
  #animationOffset = [0, 0];

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
    this.#context = this.options.canvas.getContext('2d', { alpha: false });

    this.draw(0);
    return this;
  }

  drawCell(rowIndex, columnIndex, firstCellCoordinates) {
    const x =
      columnIndex * this.#cellSize +
      firstCellCoordinates[0] +
      this.#animationOffset[0];
    const y =
      rowIndex * this.#cellSize +
      firstCellCoordinates[1] +
      this.#animationOffset[1];

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

    /*
     * TODO: make cells have isAnimated property
     * TODO: disable imageSmoothingEnabled if need pixelArt
     */

    if (this.#pressedKeys.length > 0) {
      const motions = [];

      if (this.#pressedKeys.includes('up')) motions.push([1, 1]);
      else if (this.#pressedKeys.includes('down')) motions.push([1, -1]);

      if (this.#pressedKeys.includes('left')) motions.push([0, 1]);
      else if (this.#pressedKeys.includes('right')) motions.push([0, -1]);

      if (typeof this.#animationStart === 'undefined')
        this.#animationStart = timestamp;

      const percentage =
        timestamp / (this.#animationStart + this.#animationDuration);

      if (percentage >= 100) {
        motions.forEach(([index, amount]) => {
          this.#coordinates[index] += amount;
        });
        this.#animationOffset = [0, 0];
        this.#animationStart = undefined;
      } else
        motions.forEach(([index, amount]) => {
          this.#animationOffset[index] += Math.round(amount * percentage);
        });
    }

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

  handleKeyPress(pressedKeys, animationDuration) {
    if (DEVELOPMENT) console.log(pressedKeys);
    this.#pressedKeys = Array.from(pressedKeys).filter((key) =>
      movementKeys.has(key)
    );
    this.#animationDuration = animationDuration;
  }
}
