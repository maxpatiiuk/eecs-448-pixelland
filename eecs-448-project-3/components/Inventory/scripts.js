/*
 * The name of this component
 * Later, to render this component, call:
 * new Inventory(options).render(this.container)
 */
/**
 * Draw player inventory
 * @class Inventory
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class Inventory extends Component {
  constructor(options) {
    super(options);
  }

  /**
   * @async
   * @function render
   * @memberof Inventory
   */
  async render() {
    await super.render();

    // TODO: Set event listeners and call callbacks on click

    return this;
  }
}
