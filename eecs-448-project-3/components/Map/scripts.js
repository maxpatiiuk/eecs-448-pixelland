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

  map = [];

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

    if (DEVELOPMENT) console.log(`Map seed: ${this.seed}`);

    return this;
  }

  async getDeterministicRandom(salt, max) {
    const randomNumber = stringToNumber(
      await getHash(`${this.seed.slice(0, 5)}${salt}`)
    );
    return clampInt(
      max,
      randomNumber * Math.max(1, Math.floor(max / Math.abs(randomNumber)))
    );
  }

  getCellAtCoordinate(row, col) {
    if (typeof this.map[row]?.[col] === 'undefined')
      this.generateCell(row, col);
    return (
      this.map[row]?.[col] ?? {
        isAnimated: false,
      }
    );
  }

  generateCell(row, col) {
    this.map[row] ??= {};
    this.map[row][col] = {
      backgroundColor: `hsl(0deg, 0%, 50%)`,
      isAnimated: false,
    };
  }
}
