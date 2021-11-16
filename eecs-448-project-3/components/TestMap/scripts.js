/*
 * The name of this view
 * Later, to render this view, call:
 * new TestMap(options).render(this.container)
 */

/**
 * Draw a test map environment
 * @class TestMap
 * @constructor
 * @param options
 * @extends Map
 * @public
 */
class TestMap extends Map {
  #getParameter;

  #noiseFunction;

  /**
   * @async
   * @function render
   * @memberof TestMap
   */
  async render() {
    await super.render();

    const ui = document.getElementsByClassName('ui')[0];
    const testControls = document.createElement('div');
    testControls.style.position = 'fixed';
    testControls.style.top = '0';
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

    return this;
  }

  /**
   * @function handleInputChange
   * @memberof TestMap
   */
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
   * @function generateCell
   * @param row row for cell gen
   * @param col column for cell gen
   * @memberof TestMap
   */
  async generateCell(row, col) {
    this.map[row] ??= {};
    this.map[row][col] ??= {
      backgroundColor: `hsl(0deg, 0%, ${this.#noiseFunction(row, col)}%)`,
    };
  }
}
