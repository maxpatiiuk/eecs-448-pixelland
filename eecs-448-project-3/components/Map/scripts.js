/*
 * The name of this view
 * Later, to render this view, call:
 * New Map(options).render(this.container)
 */
/**
 * Draw current player / NPC
 * @class Map
 * @constructor
 * @param options
 * @extends Component
 * @public
 */

class Map extends Component {
  seed;

  constructor(options) {
    super({ ...options, hasContainer: false });
  }

  /**
   * @async
   * @function render
   * @memberof Map
   */
  async render() {
    await super.render();

    // Generate random seed for this world
    this.seed = await getHash(Math.random());

    /*
     *Var img = new Image();
     *img.src = 'canvas_createpattern.png';
     *img.onload = function() {
     *
     */

    return this;
  }

  getCellAtCoordinate(row, col) {
    const hue = 100 - ((row * 2 - col + Math.floor(Math.random() * 50)) % 360);
    const saturation =
      30 + (Math.floor(row / 2 + col / 2 + Math.random() * 5) % 40);
    return {
      backgroundColor: `hsl(${hue}deg, ${saturation}%, 50%)`,
      isAnimated: false,
    };
  }
}
