/*
 * The name of this component
 * Later, to render this component, call:
 * new Inventory(options).render(this.container)
 */

const rows = 3;
const cols = 10;

/**
 * Draw player inventory
 * @class Inventory
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class Inventory extends Component {
  #overlay;

  isOpen = false;

  /**
   * @async
   * @function render
   * @memberof Inventory
   * @param container Container to render the view within
   */
  async render(container) {
    await super.render(container);

    // TODO: Set event listeners and call callbacks on click
    const toolbar = document.getElementsByClassName('inventory-toolbar')[0];
    toolbar.innerHTML = Array.from(
      { length: cols },
      () => `<button class='cell'></button>`
    ).join('');

    this.#overlay = document.getElementsByClassName('inventory-overlay')[0];

    const grid = this.#overlay.getElementsByClassName('inventory-grid')[0];
    grid.style.setProperty('--rows', rows);
    grid.style.setProperty('--cols', cols);
    grid.innerHTML = Array.from({ length: rows }, (_, row) =>
      Array.from(
        { length: cols },
        (_, col) => `<button class='cell'></button>`
      ).join('')
    ).join('');

    const handleClick = this.handleCellSelect.bind(this);
    const cells = Array.from(this.container.getElementsByClassName('cell'));
    cells.map((cell) => cell.addEventListener('click', handleClick));
    this.destructors.push(() =>
      cells.map((cell) => cell.removeEventListener('click', handleClick))
    );

    return this;
  }

  toggleOverlay() {
    this.isOpen = !this.isOpen;
    this.#overlay.style.display = this.isOpen ? 'flex' : 'none';
  }

  handleCellSelect(event) {
    console.log(event);
  }
}
