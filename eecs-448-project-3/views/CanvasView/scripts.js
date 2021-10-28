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

  #cellSizeUpdateListeners = [];

  #player;

  #controls;

  #map;

  #pauseMenu;

  #saveLoad;

  constructor(options) {
    super(options);
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

    // Map Generator
    this.#map = new Map();
    await this.#map.render();
    if (typeof this.options.state?.seed === 'string')
      this.#map.seed = this.options.state.seed;
    if (typeof this.options.state?.mapType === 'string')
      this.#map.mapType = this.options.state.mapType;
    this.destructors.push(() => this.#map.remove());

    // Controls
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

    // Grid
    this.#canvas = this.container.getElementsByTagName('canvas')[0];
    this.#grid = new Grid({
      canvas: this.#canvas,
      getCellAtCoordinate: this.#map.getCellAtCoordinate.bind(this.#map),
      getMovementDirection: this.#controls.getMovementDirection.bind(
        this.#controls
      ),
    });
    if (Array.isArray(this.options.state?.coordinates))
      this.#grid.coordinates = this.options.state.coordinates;
    await this.#grid.render();
    this.#controls.afterKeyPress = () => {
      this.#grid.checkPressedKeys();
    };
    this.destructors.push(() => this.#grid.remove());

    // Resize Listeners
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

    // Save Load
    this.#saveLoad = new SaveLoad();
    await this.#saveLoad.render();
    this.destructors.push(() => this.#saveLoad.remove());

    // Pause Menu
    this.#pauseMenu = new PauseMenu({
      onClick: this.handlePauseMenuInteraction.bind(this),
    });
    await this.#pauseMenu.render(
      this.container.getElementsByClassName('pause-menu')[0]
    );
    this.handlePauseMenuInteraction('resume');
    if (typeof this.#saveLoad.load() === 'undefined')
      this.#pauseMenu.loadButton.disabled = true;
    this.#pauseMenu.container.classList.add('overlay');
    this.#pauseMenu.container.classList.add('pause-menu');
    this.destructors.push(() => this.#pauseMenu.remove());

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
        this.#pauseMenu.container.style.display = '';
        this.#grid.paused = true;

        break;
      }
      case 'resume': {
        this.#pauseMenu.container.style.display = 'none';
        this.#grid.paused = false;
        document.body
          .requestFullscreen()
          .then(() => DEVELOPMENT && console.log('Full Screen'))
          .catch(console.error);
        break;
      }
      case 'save':
        this.#saveLoad.save({
          seed: this.#map.seed,
          coordinates: this.#grid.coordinates,
          mapType: this.#map.mapType,
        });
        this.#pauseMenu.loadButton.disabled = false;
        alert('Saved');
        break;
      case 'load':
        new CanvasView({
          state: this.#saveLoad.load(),
        }).render(this.container);
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
