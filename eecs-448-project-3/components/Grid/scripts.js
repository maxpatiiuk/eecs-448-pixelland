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
    
    // draw path 
    this.#context.strokeStyle = "#FFFFFF";
    this.#context.beginPath();
    // draw vertical lines right of player
    for(var x = (this.#context.canvas.width / 2) + this.#cellSize / 2; x <= this.#context.canvas.width; x += this.#cellSize) {
      this.#context.moveTo(0.5 + x, 0);
      this.#context.lineTo(0.5 + x, this.#context.canvas.height);
    }

    // draw vertical lines left of player
    for(var x = (this.#context.canvas.width / 2) - this.#cellSize / 2; x >= 0; x -= this.#cellSize) {
      this.#context.moveTo(0.5 + x, 0);
      this.#context.lineTo(0.5 + x, this.#context.canvas.height);
    }

    // draw horizontal lines below player
    for(var x = (this.#context.canvas.height / 2) + this.#cellSize / 2; x <= this.#context.canvas.height; x += this.#cellSize) {
      this.#context.moveTo(0, 0.5 + x);
      this.#context.lineTo(this.#context.canvas.width, 0.5 + x);
    }

    // draw horizontal lines above player
    for(var x = (this.#context.canvas.height / 2) - this.#cellSize / 2; x >= 0; x -= this.#cellSize) {
      this.#context.moveTo(0, 0.5 + x);
      this.#context.lineTo(this.#context.canvas.width, 0.5 + x);
    }
  
    this.#context.stroke();
  
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
