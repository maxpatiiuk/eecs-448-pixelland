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

  /**
   * @type {Boolean} mapChanged
   * @memberof Map
   * @public
   */
  mapChanged = true;

  /**
   * @async
   * @function didMapChange
   * @memberof Map
   * @returns {Boolean} mapChanged
   */
  didMapChange() {
    return this.mapChanged;
  }

  constructor(options) {
    super({ ...options, hasContainer: false });

    // Generate random seed for this world
    this.seed = options.seed ?? getHash(Math.random());
  }

  /**
   * @async
   * @function render
   * @memberof Map
   */
  async render() {
    await super.render();

    this.seed = await this.seed;

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
    return clampInt(max, randomNumber);
  }

  /**
   * @function getCellAtCoordinate
   * @param col column of cell at coordinate
   * @param row row of cell at coordinate
   * @memberof Map
   */
  getCellAtCoordinate(col, row) {
    this.mapChanged = false;
    if (typeof this.map[col]?.[row] === 'undefined')
      this.generateCell(col, row);
    return this.map[col]?.[row] ?? {};
  }

  /**
   * @function generateCell
   * @param col column for cell gen
   * @param row row for cell gen
   * @memberof Map
   */
  generateCell(col, row) {
    this.map[col] ??= {};
    this.map[col][row] = {
      backgroundColor: `hsl(0deg, 0%, 50%)`,
    };
  }

  /**
   * @function setBlockAtCoordinates
   * @param x X coordinate
   * @param y Y coordinate
   * @param block block to be placed
   * @memberof Map
   */
  setBlockAtCoordinates(x, y, block) {
    throw new Error('Not implemented');
  }
}
