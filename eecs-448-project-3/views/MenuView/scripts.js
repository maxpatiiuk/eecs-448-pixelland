/*
 * The name of this view
 * Later, to render this view, call new MenuView(options).render(this.container)
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
  constructor(options) {
    super(options);
    /*
     * You can set global variables like so:
     * this.someValue = 'abc';
     * Now, any other method can access that variable as this.someValue
     *
     */
  }

  /**
   * Renders a defined view into a container. Passes in necessary, predefined
   * render parameters.
   * @async
   * @function render
   * @memberof MainView
   * @param container Container to render the view within
   */
  async render(
    // Container would be populated with elements from index.html
    container
  ) {
    await super.render(container);

    // Listen for button clicks inside the container
    this.buttons = Array.from(this.container.getElementsByTagName('button'));
    this.buttons.forEach((button) =>
      button.addEventListener('click', this.handleClick.bind(this))
    );

    return this;
  }

  /**
   * Click handling
   * @function handleClick
   * @memberof MainView
   * @param target
   */
  handleClick({ target: button }) {
    // Once a button is clicked, render ship placement view
    new CanvasView({
      numberOfShips: Number.parseInt(button.textContent),
    }).render(this.container);
  }

  /**
   * View remove function for ephemeral objects, ie. eventListeners
   * @function remove
   * @memberof MainView
   */
  remove() {
    super.remove();

    // Unset event listeners from buttons
    this.buttons.forEach((button) =>
      button.removeEventListener('click', this.handleClick)
    );
  }
}
