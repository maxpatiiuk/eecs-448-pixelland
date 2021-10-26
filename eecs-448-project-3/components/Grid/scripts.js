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
  #destructorCalled = false;

  #hasAnimatedCells = true;

  #cellSize;

  #context;

  #isMoving = false;

  #hadResize = true;

  #movementDirection = [0, 0];

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

    // TODO: test if this and other options are remembered
    this.#context.imageSmoothingEnabled = false;

    this.draw(0);
    return this;
  }

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
      this.#coordinates[0] + rowIndex,
      this.#coordinates[1] + columnIndex,
    ];

    const cell = this.options.getCellAtCoordinate(...absoluteCoordinates);

    const cellPosition = [x, y, this.#cellSize, this.#cellSize];

    this.#hasAnimatedCells ||= cell.isAnimated;

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
    }
  }

  draw() {
    // TODO: fix player's position changing on resize

    const dimensions = [this.options.canvas.width, this.options.canvas.height];

    const firstCellCoordinates = dimensions.map((size) =>
      Math.round(
        -2 * this.#cellSize + (((size - this.#cellSize) / 2) % this.#cellSize)
      )
    );
    const cellCount = dimensions.map(
      (size) => Math.ceil(size / this.#cellSize) + 2
    );

    if (DEVELOPMENT) {
      this.#context.lineWidth = 2;
      this.#context.strokeStyle = '#fff';
    }

    if (DEBUG)
      this.#context.font = `${Math.ceil(this.#cellSize / 3)}px sans-serif`;

    if (this.#hasAnimatedCells || this.#isMoving || this.#hadResize) {
      this.#hasAnimatedCells = false;
      Array.from({ length: cellCount[0] }, (_, columnIndex) =>
        Array.from({ length: cellCount[1] }, (_, rowIndex) =>
          this.drawCell(rowIndex, columnIndex, firstCellCoordinates)
        )
      );
    }

    this.#hadResize = false;

    if (!this.#destructorCalled)
      window.requestAnimationFrame(this.draw.bind(this));
  }

  handleCellResize(cellSize) {
    this.#cellSize = cellSize;
    this.#hadResize = true;
  }

  checkPressedKeys() {
    if (this.#isMoving) return;
    this.#movementDirection = this.options.getMovementDirection();
    if (this.#movementDirection.join('') !== '00') this.startMovement();
  }

  startMovement() {
    this.#isMoving = true;
    const animationDuration =
      this.#movementDirection[0] !== 0 && this.#movementDirection[1] !== 0
        ? DIAGONAL_MOVEMENT_SPEED
        : MOVEMENT_SPEED;

    let counter = 0;
    const step = Math.floor(1000 / 60);
    const interval = setInterval(() => {
      counter += step;

      if (counter > animationDuration) {
        clearInterval(interval);
        this.#movementDirection.forEach((amount, index) => {
          this.#coordinates[index] += amount;
        });

        if (DEVELOPMENT)
          console.log(`Coordinates: ${this.#coordinates.join(' ')}`);

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
