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

// 1 block is a 1000 coordinate units
const blockSize = 1000;

const targetFps = 60;
const oneSecond = 1000;
// 2 Blocks per second
const stepDuration = Math.floor(oneSecond / targetFps);

class Grid extends Component {
  /**
   * @type {Boolean} destructorCalled
   * @memberof Grid
   * @public
   */
  #destructorCalled = false;

  /**
   * This gets overridden after render
   * @type {Integer} cellSize
   * @memberof Grid
   * @public
   */
  #cellSize = 40;

  /**
   * @type {Context} context
   * @memberof Grid
   * @public
   */
  #context;

  /**
   * @type {Boolean} needRedraw
   * @memberof Grid
   * @public
   */
  #needRedraw = true;

  /**
   * @type {Array} movementDirection
   * @memberof Grid
   * @public
   */
  #movementDirection = [0, 0];

  /**
   * @type {Integer} renderedFrameCount
   * @memberof Grid
   * @public
   */
  #renderedFrameCount = 0;

  /**
   * @type {Boolean} paused
   * @memberof Grid
   * @public
   */
  paused = false;

  /**
   * Real player coordinates (1000 = 1 block)
   * @type {Array} coordinates
   * @memberof Grid
   * @public
   */
  coordinates = [0, 0];

  // Decimal coordinates. 1 = 1 block
  #decimalCoordinates = [0, 0];

  #cellCount;

  #halfCellCount;

  #centerCellCoordinates;

  // Render one extra cells outside the viewport in all directions
  #renderOffset = 1;

  // Callback to stop current movement
  #stopMovement;

  constructor(options) {
    super({ ...options, hasContainer: false });
  }

  /**
   * @async
   * @function render
   * @memberof Grid
   * @param container Container to render the view within
   */
  async render() {
    await super.render();

    console.log(this.options.canvas);
    this.#context = this.options.canvas.getContext('2d', { alpha: false });

    this.handleCellResize(this.#cellSize);

    this.draw(0);
    return this;
  }

  /**
   * @function drawCell
   * @memberof Grid
   * @param columnIndex relative column index
   * @param rowIndex relative row index
   */
  drawCell(columnIndex, rowIndex) {
    const x = Math.floor(
      columnIndex * this.#cellSize + this.#centerCellCoordinates[0]
    );
    const y = Math.floor(
      rowIndex * this.#cellSize + this.#centerCellCoordinates[1]
    );

    const absoluteCoordinates = [
      this.#decimalCoordinates[0] + columnIndex,
      this.#decimalCoordinates[1] + rowIndex,
    ];

    const cell = this.options.getCellAtCoordinate(...absoluteCoordinates);

    const cellPosition = [x, y, this.#cellSize, this.#cellSize];

    if (typeof cell.backgroundImage === 'object')
      this.#context.drawImage(cell.backgroundImage, ...cellPosition);

    if (typeof cell.backgroundOverlayOptions === 'object')
      this.#context.drawImage(cell.backgroundOverlayOptions, ...cellPosition);

    if (typeof cell.backgroundColor === 'string') {
      this.#context.fillStyle = cell.backgroundColor;
      this.#context.fillRect(...cellPosition);
    }

    if (DEBUG) {
      // Draw cell borders
      this.#context.strokeRect(x, y, this.#cellSize, this.#cellSize);

      this.#context.fillStyle = '#000';
      // Draw cell coordinates
      this.#context.fillText(absoluteCoordinates.join(' '), x, y);
    }
  }

  /**
   * @function draw
   * @memberof Grid
   */
  draw() {
    if (
      this.#needRedraw ||
      this.#renderedFrameCount < 120 ||
      this.options.didMapChange()
    ) {
      this.#needRedraw = false;

      const count = this.#cellCount.map(
        (count, index) => count - this.#halfCellCount[index]
      );
      for (
        let columnIndex = -this.#halfCellCount[0];
        columnIndex < count[0];
        columnIndex += 1
      )
        for (
          let rowIndex = -this.#halfCellCount[1];
          rowIndex < count[1];
          rowIndex += 1
        )
          this.drawCell(columnIndex, rowIndex);
    }

    this.#renderedFrameCount += 1;

    if (!this.#destructorCalled)
      window.requestAnimationFrame(this.draw.bind(this));
  }

  /**
   * @function handleCellResize
   * @param cellSize size of game cell in viewport (relative size)
   * @memberof Grid
   */
  handleCellResize(cellSize) {
    this.#cellSize = cellSize;
    this.#needRedraw = true;

    this.#context.imageSmoothingEnabled = false;

    if (DEBUG) {
      this.#context.lineWidth = 2;
      this.#context.strokeStyle = '#fff';
      this.#context.font = `${Math.ceil(this.#cellSize / 3)}px sans-serif`;
    }

    const dimensions = [this.options.canvas.width, this.options.canvas.height];

    const cellCount = dimensions.map(
      (size) => size / this.#cellSize + this.#renderOffset * 2
    );

    this.#cellCount = cellCount.map(Math.ceil);

    this.#halfCellCount = cellCount.map(
      (count) => Math.ceil((count - (count % 2)) / 2) + this.#renderOffset
    );

    this.recalculateCenter(dimensions);
  }

  recalculateCenter(dimensions) {
    const screenSize = dimensions ?? [
      this.options.canvas.width,
      this.options.canvas.height,
    ];

    this.#centerCellCoordinates = screenSize.map((size, index) => {
      const screenCenter = (size - this.#cellSize) / 2;
      const cellCountOffset =
        1 -
        (this.coordinates[index] -
          this.#decimalCoordinates[index] * blockSize) /
          blockSize;
      return Math.round(screenCenter + cellCountOffset * this.#cellSize);
    });
  }

  // Call this after changing coordinates
  recalculateDecimalCoordinates() {
    this.#decimalCoordinates = [
      Math[this.coordinates[0] > 0 ? 'floor' : 'ceil'](
        this.coordinates[0] / blockSize
      ),
      Math[this.coordinates[1] > 0 ? 'floor' : 'ceil'](
        this.coordinates[1] / blockSize
      ),
    ];
  }

  /**
   * @function handleMovementChange
   * @memberof Grid
   */
  handleMovementChange(movementDirection) {
    if (this.#movementDirection.join(',') === movementDirection.join(','))
      return;
    this.#movementDirection = movementDirection;
    this.#stopMovement?.();
    if (this.#movementDirection.join('') !== '00') this.startMovement();
  }

  handleBlockChange() {
    const currentCell = this.options.getCellAtCoordinate(
      ...this.#decimalCoordinates
    );

    if (DEVELOPMENT) {
      console.log(`Coordinates: ${this.coordinates.join(' ')}`);
      if (typeof currentCell.onStep !== 'undefined')
        console.log(`onStep: ${currentCell.onStep}`);
    }

    currentCell.onStep?.();
  }

  /**
   * @function startMovement
   * @memberof Grid
   */
  startMovement() {
    const speed =
      this.#movementDirection[0] !== 0 && this.#movementDirection[1] !== 0
        ? DIAGONAL_MOVEMENT_SPEED
        : MOVEMENT_SPEED;

    const stepSize = Math.floor((stepDuration * blockSize) / speed);

    const interval = setInterval(() => {
      if (this.paused) return;

      this.#needRedraw = true;

      this.#movementDirection.forEach((amount, index) => {
        this.coordinates[index] += stepSize * amount;
      });

      const currentDecimalCoordinates = Array.from(this.#decimalCoordinates);
      this.recalculateDecimalCoordinates();

      this.recalculateCenter();

      if (
        currentDecimalCoordinates.join(',') !==
        this.#decimalCoordinates.join(',')
      )
        this.handleBlockChange();
    }, stepDuration);

    this.#stopMovement = () => {
      this.#needRedraw = true;
      clearInterval(interval);
    };
  }

  pxToCoordinates(x, y) {
    return [x, y].map(
      (px, index) =>
        this.#decimalCoordinates[index] +
        Math.floor((px - this.#centerCellCoordinates[index]) / this.#cellSize)
    );
  }
}
