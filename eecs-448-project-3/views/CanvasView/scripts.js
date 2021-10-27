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

  #map;

  #pauseMenu;

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

    this.#map = new Map();
    await this.#map.render();

    this.#controls = new Controls({
      handleKeyToggle: (type) => {
        if (type === 'escape')
          this.handlePauseMenuInteraction(
            this.#grid.paused ? 'resume' : 'pause'
          );
      },
    });
    await this.#controls.render();
    this.destructors.push(() => this.#controls.remove());

    this.#canvas = this.container.getElementsByTagName('canvas')[0];
    this.#grid = new Grid({
      canvas: this.#canvas,
      getCellAtCoordinate: this.#map.getCellAtCoordinate.bind(this.#map),
      getMovementDirection: this.#controls.getMovementDirection.bind(
        this.#controls
      ),
    });
    await this.#grid.render();
    this.#controls.afterKeyPress = () => {
      this.#grid.checkPressedKeys();
    };

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

    this.#pauseMenu = new PauseMenu({
      onClick: this.handlePauseMenuInteraction.bind(this),
    });
    await this.#pauseMenu.render(
      this.container.getElementsByClassName('pause-menu')[0]
    );
    this.#pauseMenu.container.classList.add('overlay');
    this.#pauseMenu.container.classList.add('pause-menu');

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

  handlePauseMenuInteraction(action) {
    switch (action) {
      /*
       * TODO: add a settings menu
       * TODO: add save&load game functionality
       */
      case 'pause': {
        this.#pauseMenu.show();
        this.#grid.paused = true;

        break;
      }
      case 'resume': {
        this.#pauseMenu.hide();
        this.#grid.paused = false;

        break;
      }
      case 'save':
        break;
      case 'load':
        break;
      case 'settings':
        break;
      case 'exit':
        new MenuView().render(this.container);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }
}
