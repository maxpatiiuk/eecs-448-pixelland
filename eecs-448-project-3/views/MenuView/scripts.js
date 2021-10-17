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
    const buttons = Array.from(this.container.getElementsByTagName('button'));
    const handleClick = this.handleClick.bind(this);
    buttons.forEach((button) => {
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
   * @memberof MainView
   * @param target
   */
  handleClick({ target: button }) {
    // Once a button is clicked, render ship placement view
    new CanvasView({
      numberOfShips: Number.parseInt(button.textContent),
    }).render(this.container);
  }
}
