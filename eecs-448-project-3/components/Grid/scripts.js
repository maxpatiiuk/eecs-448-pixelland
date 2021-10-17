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

  draw(timestamp) {
    if (typeof this.#previousFrameTimestamp === 'undefined')
      this.#previousFrameTimestamp = timestamp;
    const timePassed = timestamp - this.#previousFrameTimestamp;

    this.#previousFrameTimestamp = timestamp;

    /*
     * TODO: render grid here
     * use this.#cellSize to get cell size in px
     * use this.options.canvas and this.#context to draw on
     */

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
