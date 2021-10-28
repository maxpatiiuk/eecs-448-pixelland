/*
 * The name of this view
 * Later, to render this view, call:
 * New PauseMenu(options).render(this.container)
 */
/**
 * Handle game controls
 * @class Controls
 * @constructor
 * @param options
 * @extends PauseMenu
 * @public
 */

class PauseMenu extends Component {
  loadButton;

  /**
   * @async
   * @function render
   * @memberof Person
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
