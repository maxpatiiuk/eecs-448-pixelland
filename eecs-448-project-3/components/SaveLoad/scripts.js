/*
 * The name of this view
 * Later, to render this view, call:
 * New SaveLoad(options).render(this.container)
 */
/**
 * Handle game controls
 * @class Controls
 * @constructor
 * @param options
 * @extends SaveLoad
 * @public
 */
class SaveLoad extends Component {
  #version = '1';

  constructor(options) {
    super({
      ...options,
      hasContainer: false,
    });
  }

  save(object) {
    localStorage.setItem(
      'save',
      JSON.stringify({
        version: this.#version,
        payload: object,
      })
    );
  }

  load() {
    const { version, payload } = JSON.parse(localStorage.getItem('save')) ?? '';
    return version === this.#version ? payload : undefined;
  }
}
