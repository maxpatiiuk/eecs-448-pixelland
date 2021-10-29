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
  
  /**
   * @type {String} seed
   * @memberof Map
   * @public
   */
  seed;

  /**
   * @type {Array} map
   * @memberof Map
   * @public
   */
  map = [];

  /**
   * @type {String} mapType
   * @memberof Map
   * @public
   */
  mapType = 'rainbowland';

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
     */

    if (DEVELOPMENT) console.log(`Map seed: ${this.seed}`);

    return this;
  }

  /**
   * @async
   * @function getDeterministicRandom
   * @param salt salt based on position on map row, column
   * @param max prevent huge seed
   * @memberof Map
   */
  async getDeterministicRandom(salt, max) {
    const randomNumber = stringToNumber(
      await getHash(`${this.seed.slice(0, 5)}${salt}`)
    );
    return clampInt(
      max,
      randomNumber * Math.max(1, Math.floor(max / Math.abs(randomNumber)))
    );
  }

  /**
   * @function getCellAtCoordinate
   * @param row row of cell at coordinate
   * @param col column of cell at coordinate
   * @memberof Map
   */
  getCellAtCoordinate(row, col) {
    if (typeof this.map[row]?.[col] === 'undefined')
      this.generateCell(row, col);
    return (
      this.map[row]?.[col] ?? {
        isAnimated: false,
      }
    );
  }
  
  /**
   * @function generateCell
   * @param row row for cell gen
   * @param col column for cell gen
   * @memberof Map
   */
  generateCell(row, col) {
    this.map[row] ??= {};
    this.map[row][col] = {
      backgroundColor: `hsl(0deg, 0%, 50%)`,
      isAnimated: false,
    };
  }
}
