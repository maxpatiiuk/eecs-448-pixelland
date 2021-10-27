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
    const randomNumber = Math.abs(
      stringToNumber(await getHash(`${this.seed}${salt}`))
    );
    return (randomNumber * Math.max(1, Math.floor(max / randomNumber))) % max;
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
    const hue = 100 - ((row * 2 - col + (await random(50))) % 360);
    const saturation =
      30 + (Math.floor(row / 2 + col / 2 + (await random(5))) % 40);
    this.#map[row] ??= {};
    this.#map[row][col] = {
      backgroundColor: `hsl(${hue}deg, ${saturation}%, 50%)`,
      isAnimated: false,
    };
  }
}
