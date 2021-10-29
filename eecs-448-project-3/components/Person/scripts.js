/*
 * The name of this view
 * Later, to render this view, call:
 * New Person(options).render(this.container)
 */

/**
 * Draw current player / NPC
 * @class Person
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class Person extends Component {
  
  /**
   * @type {Person} person
   * @memberof PauseMenu
   * @public
   */
  #person;

  constructor() {
    super({});
  }

  /**
   * @async
   * @function render
   * @memberof Person
   * @param container Container to render the view within
   */
  async render(
    // Container would be populated with elements from index.html
    container
  ) {
    await super.render(container);

    /*
     * TODO: create an image for the player (from 4 directions)
     *       and display it here using css background-image
     */
    
    this.#person = this.container.getElementsByClassName('person')[0];

    return this;
  }
}
