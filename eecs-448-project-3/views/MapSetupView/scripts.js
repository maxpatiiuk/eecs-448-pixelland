/*
 * The name of this view
 * Later, to render this view, call new> MenuView(options).render(this.container)
 */
/**
 * Base MapSetupView class
 * @class MapSetupView
 * @constructor
 * @param options
 * @extends View
 * @public
 */
class MapSetupView extends View {
  
  /**
   * Renders a defined view into a container. Passes in necessary, predefined
   * render parameters.
   * @async
   * @function render
   * @memberof MapSetupView
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
   * @memberof MapSetupView
   * @param {json} target
   * @param target.button button
   */
  handleClick({ currentTarget: button }) {
    // Once a button is clicked, render ship placement view
    new CanvasView({
      state: { mapType: button.getAttribute('data-type') },
    }).render(this.container);
  }
}
