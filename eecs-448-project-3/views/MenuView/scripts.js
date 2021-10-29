/*
 * The name of this view
 * Later, to render this view, call new> MenuView(options).render(this.container)
 */

/**
 * Base MenuView class
 * @class MenuView
 * @constructor
 * @param options
 * @extends View
 * @public
 */
class MenuView extends View {

  /**
   * @type {Object} saveLoad
   * @memberof MenuView
   * @public
   */
  #saveLoad;

  constructor() {
    super({});
  }

  /**
   * Renders a defined view into a container. Passes in necessary, predefined
   * render parameters.
   * @async
   * @function render
   * @memberof MenuView
   * @param container Container to render the view within
   */
  async render(
    // Container would be populated with elements from index.html
    container
  ) {
    await super.render(container);

    // Save Load
    this.#saveLoad = new SaveLoad();
    await this.#saveLoad.render();
    this.destructors.push(() => this.#saveLoad.remove());

    // Listen for button clicks inside the container
    const buttons = Array.from(this.container.getElementsByTagName('button'));
    const handleClick = this.handleClick.bind(this);
    buttons.forEach((button) => {
      if (
        button.getAttribute('data-action') === 'load-game' &&
        typeof this.#saveLoad.load() === 'undefined'
      )
        button.disabled = true;
      button.addEventListener('click', handleClick);
      this.destructors.push(() =>
        button.removeEventListener('click', handleClick)
      );
    });

    return this;
  }

  /**
   * Click handling
   * @function handleClick
   * @memberof MapSetupView
   * @param {json} target
   * @param target.button button
   */
  handleClick({ target: button }) {
    // Once a button is clicked, render ship placement view
    if (button.getAttribute('data-action') === 'load-game')
      new CanvasView({
        state: this.#saveLoad.load(),
      }).render(this.container);
    else new MapSetupView().render(this.container);
  }
}
