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

  // Real player coordinates
  /**
   * @type {Array} coordinates
   * @memberof Grid
   * @public
   */
  coordinates = [0, 0];

  /*
   * While walking between cells, this.#animationOffset
   * are smoothly transitioning between [0,0] and the movement destination
   * (e.x, [1,0] or [-1, -1])
   */
  /**
   * @type {Array} animationOffset
   * @memberof Grid
   * @public
   */
  #animationOffset = [0, 0];

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

    this.draw(0);
    return this;
  }

  /**
   * @function drawCell
   * @memberof Grid
   * @param rowIndex relative row index
   * @param columnIndex relative column index
   * @param firstCellCoordinates starting cell coordinates
   */
  drawCell(rowIndex, columnIndex, firstCellCoordinates) {
    const x = Math.floor(
      columnIndex * this.#cellSize +
        firstCellCoordinates[0] -
        this.#cellSize * this.#animationOffset[1]
    );
    const y = Math.floor(
      rowIndex * this.#cellSize +
        firstCellCoordinates[1] -
        this.#cellSize * this.#animationOffset[0]
    );

    const absoluteCoordinates = [
      this.coordinates[0] + rowIndex,
      this.coordinates[1] + columnIndex,
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
    const dimensions = [this.options.canvas.width, this.options.canvas.height];

    const firstCellCoordinates = dimensions.map((size) =>
      Math.round(
        -2 * this.#cellSize + (((size - this.#cellSize) / 2) % this.#cellSize)
      )
    );
    const cellCount = dimensions.map(
      (size) => Math.ceil(size / this.#cellSize) + 2
    );

    if (
      this.#hasAnimatedCells ||
      this.#isMoving ||
      this.#hadResize ||
      this.#renderedFrameCount < 120 ||
      this.options.didMapChange()
    ) {
      this.#hasAnimatedCells = false;
      Array.from({ length: cellCount[0] }, (_, columnIndex) =>
        Array.from({ length: cellCount[1] }, (_, rowIndex) =>
          this.drawCell(rowIndex, columnIndex, firstCellCoordinates)
        )
      );
    }

    this.#renderedFrameCount += 1;

    this.#hadResize = false;

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

    let counter = 0;
    const step = Math.floor(1000 / 60);
    const interval = setInterval(() => {
      if (this.paused) return;

      counter += step;

      if (counter > animationDuration) {
        clearInterval(interval);
        this.#movementDirection.forEach((amount, index) => {
          this.coordinates[index] += amount;
        });

        if (DEVELOPMENT)
          console.log(`Coordinates: ${this.coordinates.join(' ')}`);

        this.#animationOffset = [0, 0];
        this.#isMoving = false;
        this.#hadResize = true;
        this.checkPressedKeys();
        return;
      }

      const animationPercentage = Math.min(1, counter / animationDuration);
      this.#movementDirection.forEach((amount, index) => {
        this.#animationOffset[index] = amount * animationPercentage;
      });
    }, step);
  }
}
