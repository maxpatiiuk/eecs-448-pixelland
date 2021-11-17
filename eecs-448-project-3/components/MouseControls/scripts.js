/*
 * The name of this view
 * Later, to render this view, call:
 * New MouseControls(options).render(this.container)
 */

/**
 * Handle game control keys
 * @class MouseControls
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class MouseControls extends Component {
  constructor(options) {
    super({
      ...options,
      hasContainer: false,
    });
  }

  /**
   * Handle render-related functionality for controls
   * @async
   * @function render
   * @memberof Controls
   */
  async render() {
    await super.render();

    const onClick = this.handleClick.bind(this);
    document.body.addEventListener('mousedown', onClick);
    this.destructors.push(() =>
      document.body.addEventListener('mousedown', onClick)
    );

    return this;
  }

  handleClick({ path, pageX, pageY }) {
    if (this.options.getIgnoredBlocks().some((block) => path.includes(block)))
      return;

    const [x, y] = this.options.pxToCoordinates(pageX, pageY);
    const block = this.options.getCurrentToolbarBlock();
    if (typeof block === 'undefined') return;

    this.options.setBlockAtCoordinates(x, y, block);

    if (DEVELOPMENT) console.log(`Placing ${block} at ${x}x${y}`);
  }
}
