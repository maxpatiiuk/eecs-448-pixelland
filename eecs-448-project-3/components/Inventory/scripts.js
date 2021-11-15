/*
 * The name of this component
 * Later, to render this component, call:
 * new Inventory(options).render(this.container)
 */

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

  currentToolbarBlock;

  #currentInventoryBlock;

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
      () => `<button class='cell toolbar-cell'></button>`
    ).join('');

    this.#overlay = document.getElementsByClassName('inventory-overlay')[0];

    this.container.style.setProperty(
      '--texture-count',
      this.options.texturesCount + 1
    );
    this.container.style.setProperty(
      '--texture-size',
      `${this.options.textureSize}px`
    );

    const grid = this.#overlay.getElementsByClassName('inventory-grid')[0];
    grid.style.setProperty('--cols', cols);
    grid.innerHTML = Object.entries(this.options.blocks)
      .map(
        ([blockName, { variations }]) => `<button
          class='cell'
          data-block='${blockName}'
          aria-label='${blockName}'
          style="
            --texture-index: ${variations[0]};
            background-image: url('${this.options.src}');
          "
        ></button>`
      )
      .join('');

    const emptyCellCount =
      cols - (Object.keys(this.options.blocks).length % cols);
    grid.innerHTML += Array.from(
      { length: emptyCellCount },
      () => `<button class='cell'></button>`
    ).join('');

    const handleClick = this.handleCellSelect.bind(this);
    const cells = Array.from(this.container.getElementsByClassName('cell'));
    cells.map((cell) => cell.addEventListener('click', handleClick));
    this.destructors.push(() => {
      cells.map((cell) => cell.removeEventListener('click', handleClick));
    });

    return this;
  }

  toggleOverlay() {
    this.isOpen = !this.isOpen;
    this.#overlay.style.display = this.isOpen ? 'flex' : 'none';
    this.deselectInventoryBlock();
  }

  deselectInventoryBlock() {
    this.#currentInventoryBlock?.classList.remove('active');
    this.#currentInventoryBlock = undefined;
  }

  selectInventoryBlock(cell) {
    this.deselectInventoryBlock();
    this.#currentInventoryBlock = cell;
    this.#currentInventoryBlock.classList.add('active');
  }

  deselectToolbarBlock() {
    this.currentToolbarBlock?.classList.remove('active');
    this.currentToolbarBlock = undefined;
  }

  selectToolbarBlock(cell) {
    this.deselectToolbarBlock();
    this.currentToolbarBlock?.classList.remove('active');
    this.currentToolbarBlock = cell;
    this.currentToolbarBlock.classList.add('active');
  }

  /*
   *ClearToolbarBlock(slot) {
   *slot.style.removeProperty('--texture-index');
   *slot.style.removeProperty('background-image');
   *slot.removeAttribute('data-block');
   *}
   */

  setToolbarBlock(slot, cell) {
    slot.style.setProperty(
      '--texture-index',
      cell.style.getPropertyValue('--texture-index')
    );
    slot.style.setProperty(
      'background-image',
      cell.style.getPropertyValue('background-image')
    );
    slot.dataset.block = cell.getAttribute('data-block');
  }

  handleCellSelect({ target }) {
    const block = target.getAttribute('data-block');
    const cellHasBlock = block !== null;

    const isToolbarCell = target.classList.contains('toolbar-cell');

    if (isToolbarCell) {
      if (typeof this.#currentInventoryBlock !== 'undefined')
        this.setToolbarBlock(target, this.#currentInventoryBlock);
      if (typeof this.#currentInventoryBlock !== 'undefined' || cellHasBlock)
        this.selectToolbarBlock(target);
      this.deselectInventoryBlock();
    } else {
      if (cellHasBlock) this.selectInventoryBlock(target);
      else this.deselectInventoryBlock();
    }

    if (DEVELOPMENT)
      console.log(
        `Select ${block} in the ${isToolbarCell ? 'toolbar' : 'inventory'}`
      );
  }
}
