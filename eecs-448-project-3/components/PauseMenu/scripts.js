/*
 * The name of this view
 * Later, to render this view, call:
 * New PauseMenu(options).render(this.container)
 */

/**
 * Handle game pause functions
 * @class PauseMenu
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class PauseMenu extends Component {

  /**
   * @type {Button} loadButton
   * @memberof PauseMenu
   * @public
   */
  loadButton;

  constructor(options) {
    super(options);
  }

  /**
   * @async
   * @function render
   * @memberof PauseMenu
   * @param container Container to render the view within
   */
  async render(
    // Container would be populated with elements from index.html
    container
  ) {
    await super.render(container);

    const handleClick = ({ target }) =>
      this.options.onClick(target.getAttribute('data-action'));
    Array.from(this.container.getElementsByTagName('button'), (button) => {
      button.addEventListener('click', handleClick);
      this.destructors.push(() =>
        button.removeEventListener('click', handleClick)
      );
      if (button.getAttribute('data-action') === 'load')
        this.loadButton = button;
    });

    return this;
  }
}
