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
  /**
   * @type {Boolean} destructorCalled
   * @memberof Grid
   * @public
   */
  #destructorCalled = false;

  /**
   * @type {Boolean} hasAnimatedCells
   * @memberof Grid
   * @public
   */
  #hasAnimatedCells = true;

  /**
   * This get's overriden after render
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
   * @type {Boolean} isMoving
   * @memberof Grid
   * @public
   */
  #isMoving = false;

  /**
   * @type {Boolean} hadResize
   * @memberof Grid
   * @public
   */
  #hadResize = true;

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

  #blockSize = 1000;

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

  /*
   * Render two extra cells outside the viewport in all directions
   * TODO: check if this is necessary
   */
  #renderOffset = 2;

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

    this.#hasAnimatedCells ||= cell.isAnimated === true;

    if (typeof cell.backgroundImage === 'object')
      this.#context.drawImage(
        cell.backgroundImage,
        ...cell.backgroundImageOptions,
        ...cellPosition
      );

    if (typeof cell.backgroundOverlayOptions === 'object')
      this.#context.drawImage(
        cell.backgroundImage,
        ...cell.backgroundOverlayOptions,
        ...cellPosition
      );

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
      this.#hasAnimatedCells ||
      this.#isMoving ||
      this.#hadResize ||
      // TODO: check if this is necessary
      this.#renderedFrameCount < 120 ||
      this.options.didMapChange()
    ) {
      this.#hasAnimatedCells = false;
      this.#hadResize = false;

      Array.from({ length: this.#cellCount[0] }, (_, columnIndex) =>
        Array.from({ length: this.#cellCount[1] }, (_, rowIndex) =>
          this.drawCell(
            columnIndex - this.#halfCellCount[0] - this.#renderOffset,
            rowIndex - this.#halfCellCount[1] - this.#renderOffset
          )
        )
      );
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
    this.#hadResize = true;

    this.#context.imageSmoothingEnabled = false;

    if (DEBUG) {
      this.#context.lineWidth = 2;
      this.#context.strokeStyle = '#fff';
      this.#context.font = `${Math.ceil(this.#cellSize / 3)}px sans-serif`;
    }

    const dimensions = [this.options.canvas.width, this.options.canvas.height];

    this.#cellCount = dimensions.map(
      (size) => Math.ceil(size / this.#cellSize) + this.#renderOffset
    );

    this.#halfCellCount = this.#cellCount.map(
      (count) => (count - this.#renderOffset - (count % 2)) / 2 - 1
    );

    this.recalculateCenter(dimensions);
  }

  recalculateCenter(dimensions) {
    const screenSize = dimensions ?? [
      this.options.canvas.width,
      this.options.canvas.height,
    ];

    this.#centerCellCoordinates = screenSize.map((size, index) => {
      const screenOffset = Math.round(
        ((size - this.#cellSize) / 2) % this.#cellSize
      );
      const cellCountOffset =
        this.#halfCellCount[index] -
        (this.coordinates[index] % this.#blockSize) / this.#blockSize;
      return screenOffset + cellCountOffset * this.#cellSize;
    });
  }

  // Call this after changing coordinates
  recalculateDecimalCoordinates() {
    this.#decimalCoordinates = [
      Math[this.coordinates[0] > 0 ? 'floor' : 'ceil'](
        this.coordinates[0] / this.#blockSize
      ),
      Math[this.coordinates[1] > 0 ? 'floor' : 'ceil'](
        this.coordinates[1] / this.#blockSize
      ),
    ];
  }

  /**
   * @function checkPressedKeys
   * @memberof Grid
   */
  checkPressedKeys() {
    if (this.#isMoving) return;
    this.#movementDirection = this.options.getMovementDirection();
    if (this.#movementDirection.join('') !== '00') this.startMovement();
  }

  /**
   * @function startMovement
   * @memberof Grid
   */
  startMovement() {
    this.#isMoving = true;
    const animationDuration =
      this.#movementDirection[0] !== 0 && this.#movementDirection[1] !== 0
        ? DIAGONAL_MOVEMENT_SPEED
        : MOVEMENT_SPEED;

    // Update current position 60 times per second
    const step = Math.floor(1000 / 60);

    let counter = 0;
    const initialCoordinates = Array.from(this.coordinates);
    const interval = setInterval(() => {
      if (this.paused) return;

      counter += step;

      const animationPercentage =
        Math.min(1, counter / animationDuration) * this.#blockSize;
      this.#movementDirection.forEach((amount, index) => {
        this.coordinates[index] = Math.round(
          initialCoordinates[index] + amount * animationPercentage
        );
      });

      this.recalculateDecimalCoordinates();
      this.recalculateCenter();

      if (counter > animationDuration) {
        clearInterval(interval);

        const currentCell = this.options.getCellAtCoordinate(
          ...this.#decimalCoordinates
        );

        if (DEVELOPMENT) {
          console.log(`Coordinates: ${this.coordinates.join(' ')}`);
          if (typeof currentCell.onStep !== 'undefined')
            console.log(`onStep: ${currentCell.onStep}`);
        }

        this.#isMoving = false;
        this.#hadResize = true;

        currentCell.onStep?.();
        this.checkPressedKeys();
      }
    }, step);
  }
}
