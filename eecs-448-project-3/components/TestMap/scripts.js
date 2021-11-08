/*
 * The name of this view
 * Later, to render this view, call:
 * new TestMap(options).render(this.container)
 */
/**
 * Draw current player / NPC
 * @class TestMap
 * @constructor
 * @param options
 * @extends Component
 * @public
 */

class TestMap extends Map {
  #mapType = 'test';

  #getParameter;

  #noiseFunction;

  async render() {
    await super.render();

    const ui = document.getElementsByClassName('ui')[0];
    const testControls = document.createElement('div');
    testControls.innerHTML = await fetch('./components/TestMap/testPanel.html')
      .then(async (response) => response.text())
      .catch(console.error);
    ui.append(testControls);

    this.#getParameter = Object.fromEntries(
      Array.from(testControls.getElementsByTagName('input'), (input) => [
        input.name,
        () => Number.parseInt(input.value),
      ])
    );

    const handleChange = this.handleInputChange.bind(this);
    testControls.addEventListener('change', handleChange);
    this.destructors.push(() =>
      testControls.removeEventListener('change', handleChange)
    );
    handleChange();

    /*
     *Const createMaskLayer = async (baseProbabilities, index = '') =>
     *generateMaskLayer(
     *  baseProbabilities,
     *  this.seed,
     *  index,
     *  this.getDeterministicRandom.bind(this)
     *);
     *const [biomeMaskBottom, biomeMaskTop] = await Promise.all(
     *biomeProbabilities.map(async (baseProbabilities, index) =>
     *  createMaskLayer(baseProbabilities, index)
     *)
     *);
     *
     *this.#getBiomeAtCell = (x, y) => {
     *const leftBit = biomeMaskBottom(x, y) ? 0 : 1;
     *const rightBit = biomeMaskTop(x, y) ? 0 : 1;
     *const binaryIndex = `${leftBit}${rightBit}`;
     *const decimalIndex = Number.parseInt(binaryIndex, 2);
     *return Object.keys(biomes)[decimalIndex];
     *};
     *
     *this.#getHeightAtCell = await createMaskLayer(heightLayer);
     */

    return this;
  }

  handleInputChange() {
    this.map = [];
    this.mapChanged = true;
    let step = this.#getParameter.step();
    if (Number.isNaN(step)) step = 1;
    let scale = Math.max(1, this.#getParameter.scale());
    if (Number.isNaN(scale)) scale = 16;
    let cutOff = this.#getParameter.cutOff();
    if (Number.isNaN(cutOff)) cutOff = undefined;

    const noiseFunction = makeNoise2D(stringToNumber(`${this.seed}`));
    this.#noiseFunction =
      typeof cutOff === 'undefined'
        ? (x, y) => {
            const value = noiseFunction(x / scale, y / scale) * 100;
            return value - (value % step);
          }
        : (x, y) =>
            noiseFunction(x / scale, y / scale) * 100 > cutOff ? 100 : 0;
  }

  /**
   * @function getCellAtCoordinate
   * @param row row of cell at coordinate
   * @param col column of cell at coordinate
   * @memberof MinecraftMap
   */
  getCellAtCoordinate(row, col) {
    if (typeof this.map[row]?.[col] === 'undefined')
      this.generateCell(row, col);
    return this.map[row]?.[col] ?? {};
  }

  /**
   * @function generateCell
   * @param row row for cell gen
   * @param col column for cell gen
   * @memberof MinecraftMap
   */
  async generateCell(row, col) {
    this.mapChanged = false;
    this.map[row] ??= {};
    this.map[row][col] ??= {
      backgroundColor: `hsl(0deg, 0%, ${this.#noiseFunction(row, col)}%)`,
    };
  }
}
