/*
 * The name of this view
 * Later, to render this view, call:
 * New GameOverView(options).render(container)
 */

/**
 * Base GameOverView class
 * @class GameOverView
 * @constructor
 * @param options
 * @extends View
 * @public
 */
class GameOverView extends View {
  constructor(options) {
    super(options);
  }

  /**
   * Renders a defined view into a container. Passes in necessary, predefined
   * render parameters.
   * @async
   * @function render
   * @memberof GameOverView
   * @param container Container to render the view within
   */
  async render(
    // Container would be populated with elements from index.html
    container
  ) {
    await super.render(container);
    /* Display the appropriate lose/win message */
    this.container.getElementsByTagName('p')[0].textContent = this.options.win
      ? 'You Won!'
      : 'You Lost.';

    /*
     * Listen for "Play again" button click, Once button is clicked,call:
     * new MainView().render(this.container)
     */
    const button = this.container.getElementsByTagName('button')[0];
    const handlePlayAgain = async () => new MenuView().render(this.container);
    button.addEventListener('click', handlePlayAgain);
    this.destructors.push(() =>
      button.removeEventListener('click', handlePlayAgain)
    );

    return this;
  }
}
