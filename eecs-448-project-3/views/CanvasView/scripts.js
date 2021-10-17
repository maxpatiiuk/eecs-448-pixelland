/*
 * The name of this view
 * Later, to render this view, call:
 * New CanvasView(options).render(this.container)
 */
/**
 * Base CanvasView class
 * @class CanvasView
 * @constructor
 * @param options
 * @extends View
 * @public
 */
class CanvasView extends View {
  #canvas;

  #grid;

  #cellSize;

  #cellSizeUpdateListeners;

  #player;

  #controls;

  constructor() {
    super({});
    this.#cellSizeUpdateListeners = [];
  }

  /**
   * Renders a defined view into a container. Passes in necessary, predefined
   * render parameters.
   * @async
   * @function render
   * @memberof GameBoardView
   * @param container Container to render the view within
   */
  async render(
    // Container would be populated with elements from index.html
    container
  ) {
    await super.render(container);

    const overlay = this.container.getElementsByClassName('players')[0];
    const playerContainer = document.createElement('div');
    overlay.append(playerContainer);
    this.#player = new Person();
    await this.#player.render(playerContainer);
    this.destructors.push(() => this.#player.remove());

    this.#canvas = this.container.getElementsByTagName('canvas')[0];
    this.#grid = new Grid({ canvas: this.#canvas });
    await this.#grid.render();
    this.destructors.push(() => this.#grid.remove());
    this.#cellSizeUpdateListeners.push(
      this.#grid.handleCellResize.bind(this.#grid)
    );

    const handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', handleResize);
    this.destructors.push(() =>
      window.addEventListener('resize', handleResize)
    );
    handleResize();

    this.#controls = new Controls({
      processKeyPress: this.#grid.handleKeyPress.bind(this),
    });
    await this.#controls.render();
    this.destructors.push(() => this.#controls.remove());

    return this;
  }

  handleResize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
    this.#cellSize = Math.ceil(
      Math.max(window.innerHeight, window.innerWidth) * CELL_SIZE
    );
    this.container.style.setProperty('--cell-size', `${this.#cellSize}px`);

    if (DEBUG)
      console.log(
        `Canvas size: ${this.#canvas.width}x${this.#canvas.height}.\t` +
          `Cell size: ${this.#cellSize}px`
      );

    // Notify subscribed components about cell size change
    this.#cellSizeUpdateListeners.forEach((listener) =>
      listener(this.#cellSize)
    );
  }
}
