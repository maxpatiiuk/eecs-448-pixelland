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

  #coordinates = [0, 0];

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

    this.#context.fillStyle = `#${Math.floor(
      ((x + 1) * (y + 1) * 20_000) % 16_777_215
    ).toString(16)}`;
    this.#context.fillRect(x, y, this.#cellSize, this.#cellSize);
    if (DEVELOPMENT)
      this.#context.strokeRect(x, y, this.#cellSize, this.#cellSize);

    /*
     *Var img = new Image();
     *img.src = 'canvas_createpattern.png';
     *img.onload = function() {
     *
     */
  }

  draw(timestamp) {
    if (typeof this.#previousFrameTimestamp === 'undefined')
      this.#previousFrameTimestamp = timestamp;
    const timePassed = timestamp - this.#previousFrameTimestamp;

    this.#previousFrameTimestamp = timestamp;

    const dimensions = [this.options.canvas.width, this.options.canvas.height];

    const firstCellCoordinates = dimensions.map(
      (size) =>
        -this.#cellSize + (((size - this.#cellSize) / 2) % this.#cellSize)
    );
    const cellCount = dimensions.map(
      (size) => Math.ceil(size / this.#cellSize) + 1
    );

    if (DEVELOPMENT) {
      this.#context.lineWidth = 2;
      this.#context.strokeStyle = '#fff';
    }

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
