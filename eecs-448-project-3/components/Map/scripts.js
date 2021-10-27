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

  #map;

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
    this.seed = (await getHash(Math.random())).slice(0, 5);

    /*
     *Var img = new Image();
     *img.src = 'canvas_createpattern.png';
     *img.onload = function() {
     *
     */

    if (DEVELOPMENT) console.log(`Map seed: ${this.seed}`);

    this.#map = [];

    return this;
  }

  async getDeterministicRandom(salt, max) {
    const randomNumber = stringToNumber(await getHash(`${this.seed}${salt}`));
    return clampInt(
      max,
      randomNumber * Math.max(1, Math.floor(max / Math.abs(randomNumber)))
    );
  }

  getCellAtCoordinate(row, col) {
    if (typeof this.#map[row]?.[col] === 'undefined')
      this.generateCell(row, col);
    return (
      this.#map[row]?.[col] ?? {
        isAnimated: false,
      }
    );
  }

  async generateCell(row, col) {
    const random = this.getDeterministicRandom.bind(this, `${row},${col}`);
    const baseHue = clampInt(360, stringToNumber(this.seed));
    const hue = clampInt(360, baseHue + row * 2 - col + (await random(50)));
    const saturation =
      20 + clampInt(40, Math.floor(row / 2 + col / 2 + (await random(5))));
    this.#map[row] ??= {};
    this.#map[row][col] = {
      backgroundColor: `hsl(${hue}deg, ${saturation}%, 50%)`,
      isAnimated: false,
    };
  }
}
