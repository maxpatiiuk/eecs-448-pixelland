/**
 * Base class for views
 * @class View
 * @constructor
 * @param {options} options
 * @param templateDirectory
 * @public
 */
class View {
  /**
   * View Name
   * @type {String}
   * @memberof View
   * @public
   */
  #name;

  /**
   * Destructors
   * @type {Array}
   * @memberof View
   * @public
   */
  destructors = [];

  /**
   * hasContainer
   * @type {Boolean}
   * @memberof View
   * @public
   */
  #hasContainer = true;

  /**
   * Total count of rendered views
   * @type {Number}
   * @memberof View
   * @public
   */
  static #index = 0;

  /**
   * Record<id, view> of currently visible views
   * @type {object}
   * @memberof View
   * @public
   */
  static #activeViews = {};

  /**
   * Record<viewName, string|Promise<string>> of view templates
   * @type {object}
   * @memberof View
   * @public
   */
  static #viewTemplate = {};

  constructor({ templateDirectory = 'views', ...options } = {}) {
    this.#name = this.constructor.name;
    this.options = {
      tagName: 'div',
      ...options,
    };
    this.destructors = [];
    this.#hasContainer = options.hasContainer ?? true;

    // Download the template if haven't done so already
    if (this.#hasContainer && !(this.#name in View.#viewTemplate))
      View.#viewTemplate[this.#name] = fetch(
        `./${templateDirectory}/${this.#name}/index.html`
      ).then(async (response) => response.text());
  }

  /**
   * Renders a defined view into a container. Passes in necessary, predefined
   * render parameters.
   * @async
   * @function render
   * @memberof View
   * @param container Container to render the view within
   */
  async render(container) {
    const { tagName, ...options } = this.options;
    this.options = options;

    if (!this.#hasContainer && typeof container === 'undefined') return;

    const currentViewId = container.id;
    const currentView = View.#activeViews[currentViewId];

    currentView?.remove?.();
    View.#activeViews[currentViewId || ''] = undefined;

    // Clear view's content
    const id = `${this.#name}-${View.#index}`;
    container.outerHTML = `<${tagName}
      class="${this.#name}"
      id="${id}"
    ></${tagName}>`;

    const newContainer = document.getElementById(id);

    this.container = newContainer;

    if (typeof View.#viewTemplate[this.#name] !== 'string')
      View.#viewTemplate[this.#name] = await View.#viewTemplate[this.#name];

    newContainer.innerHTML = View.#viewTemplate[this.#name];
    View.#index += 1;
  }

  remove() {
    this.destructors.forEach((destructor) => destructor());
  }
}
