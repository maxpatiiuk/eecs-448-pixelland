/*
 * The name of this view
 * Later, to render this view, call:
 * New Controls(options).render(this.container)
 */
/**
 * Handle game controls
 * @class Controls
 * @constructor
 * @param options
 * @extends Component
 * @public
 */

const movementKeys = new Set(['up', 'down', 'left', 'right']);

const keyMapper = {
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyK: 'up',
  KeyJ: 'down',
  KeyH: 'left',
  KeyL: 'right',
  Escape: 'escape',
};

const toggleKeys = {
  Escape: 'escape',
};

class Controls extends Component {
  #pressedKeys = new Set();

  // This callback is set in CanvasView
  afterKeyPress = undefined;

  constructor(options) {
    super({
      ...options,
      hasContainer: false,
    });
  }

  /**
   * @async
   * @function render
   * @memberof Person
   */
  async render() {
    await super.render();

    const handleKeyPress = this.handleKeyPress.bind(this);
    document.body.addEventListener('keydown', handleKeyPress);
    this.destructors.push(() =>
      document.body.removeEventListener('keydown', handleKeyPress)
    );
    document.body.addEventListener('keyup', handleKeyPress);
    this.destructors.push(() =>
      document.body.removeEventListener('keyup', handleKeyPress)
    );

    return this;
  }

  handleKeyPress({ type, code }) {
    if (code in toggleKeys) {
      if (type === 'keyup') this.options.handleKeyToggle(toggleKeys[code]);
      return;
    }

    if (!(code in keyMapper)) return;

    this.#pressedKeys[type === 'keydown' ? 'add' : 'delete'](keyMapper[code]);

    if (DEVELOPMENT) console.log(Array.from(this.#pressedKeys));

    if (this.#pressedKeys.has('up') && this.#pressedKeys.has('down'))
      this.#pressedKeys.delete('down');
    if (this.#pressedKeys.has('left') && this.#pressedKeys.has('right'))
      this.#pressedKeys.delete('left');

    if (typeof this.afterKeyPress !== 'undefined') this.afterKeyPress();
  }

  getPressedSpecialKeys() {
    return Array.from(this.#pressedKeys).filter(
      (key) => !movementKeys.has(key)
    );
  }

  getMovementDirection() {
    const pressedKeys = new Set(
      Array.from(this.#pressedKeys).filter((key) => movementKeys.has(key))
    );

    const movementDirection = [0, 0];

    if (pressedKeys.has('up')) movementDirection[0] = -1;
    else if (pressedKeys.has('down')) movementDirection[0] = 1;

    if (pressedKeys.has('left')) movementDirection[1] = -1;
    else if (pressedKeys.has('right')) movementDirection[1] = 1;

    return movementDirection;
  }
}
