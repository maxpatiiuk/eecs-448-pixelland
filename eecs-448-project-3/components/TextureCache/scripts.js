/*
 * The name of this view
 * Later, to render this view, call:
 * New TextureCache(options).render(this.container)
 */

/**
 * Resize the textures to correct size once after every screen resolution
 * change, rather than on every render
 * @class TextureCache
 * @constructor
 * @param options
 * @extends Component
 * @public
 */

class TextureCache extends Component {
  canvases;

  #contexts;

  #image;

  constructor(options) {
    super({ ...options, hasContainer: false });
  }

  /**
   * @async
   * @function render
   * @memberof TextureCache
   */
  async render() {
    await super.render();

    if (typeof this.options.src === 'undefined') return this;

    this.canvases = Array.from({ length: this.options.texturesCount }, () =>
      document.createElement('canvas')
    );
    this.#contexts = this.canvases.map((canvas) => canvas.getContext('2d'));

    this.#image = new Image();
    this.#image.src = this.options.src;
    await new Promise((resolve) =>
      this.#image.addEventListener('load', resolve, { once: true })
    );

    if (DEBUG) {
      const container = document.createElement('div');
      this.canvases.map((canvas) => container.append(canvas));
      container.style.position = 'absolute';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '100';
      container.style.width = '100%';
      document.body.append(container);
    }

    return this;
  }

  /**
   * @function handleCellResize
   * @param cellSize size of game cell in viewport (relative size)
   * @memberof TextureCache
   */
  handleCellResize(cellSize) {
    if (typeof this.#image === 'undefined') return;

    this.canvases.forEach((canvas) => {
      canvas.width = cellSize;
      canvas.height = cellSize;
    });

    this.#contexts.forEach((context, index) => {
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, cellSize, cellSize);
      context.drawImage(
        this.#image,
        this.options.textureSize * index,
        0,
        this.options.textureSize,
        this.options.textureSize,
        0,
        0,
        cellSize,
        cellSize
      );
    });
  }
}
