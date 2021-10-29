/*
 * The name of this view
 * Later, to render this view, call:
 * New SaveLoad(options).render(this.container)
 */

/**
 * Handle context saving and loading
 * @class SaveLoad
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class SaveLoad extends Component {
  
  /**
   * @type {String} version
   * @memberof SaveLoad
   * @public
   */
  #version = '1';

  constructor(options) {
    super({
      ...options,
      hasContainer: false,
    });
  }

  /**
   * @function save
   * @param object JS object to be stored
   * @memberof SaveLoad
   */
  save(object) {
    localStorage.setItem(
      'save',
      JSON.stringify({
        version: this.#version,
        payload: object,
      })
    );
  }

  /**
   * @function load
   * @memberof SaveLoad
   */
  load() {
    const { version, payload } = JSON.parse(localStorage.getItem('save')) ?? '';
    return version === this.#version ? payload : undefined;
  }
}
