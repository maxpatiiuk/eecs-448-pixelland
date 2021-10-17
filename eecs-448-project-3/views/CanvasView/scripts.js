/*
 * The name of this view
 * Later, to render this view, call:
 * New CanvasView(options).render(this.container)
 */
/**
 * Base GameBoard class
 * @class CanvasView
 * @constructor
 * @param options
 * @extends View
 * @public
 */
class CanvasView extends View {
  #canvas;

  #context;

  constructor() {
    super({});
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

    this.#canvas = this.container.getElementsByTagName('canvas')[0];
    this.#context = this.#canvas.getContext('2d');

    const handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', handleResize);
    this.destructors.push(() =>
      window.addEventListener('resize', handleResize)
    );
    handleResize();

    // TODO: cell size: Math.ceil(Math.max(window.innerHeight,window.innerWidth)*0.04)

    return this;
  }

  handleResize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
  }
}
