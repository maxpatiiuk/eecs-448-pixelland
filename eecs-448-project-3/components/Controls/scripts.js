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

const keyMapper = {
  KeyW: 'Up',
  KeyS: 'Down',
  KeyA: 'Left',
  KeyD: 'Right',
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  KeyK: 'Up',
  KeyJ: 'Down',
  KeyH: 'Left',
  KeyL: 'Right',
};

class Controls extends Component {
  #pressedKeys = new Set();

  #lastKeyPressTimestamp = 0;

  #timeOut = undefined;

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
    if (!(code in keyMapper)) return;
    this.#pressedKeys[type === 'keydown' ? 'add' : 'delete'](keyMapper[code]);

    if (this.#pressedKeys.has('up') && this.#pressedKeys.has('down'))
      this.#pressedKeys.delete('down');
    if (this.#pressedKeys.has('left') && this.#pressedKeys.has('right'))
      this.#pressedKeys.delete('left');

    if (this.#lastKeyPressTimestamp + MOVEMENT_SPEED < Date.now())
      this.reportPressedKeys();
    else {
      if (typeof this.#timeOut !== 'undefined') clearTimeout(this.#timeOut);
      this.#timeOut = setTimeout(
        () => this.reportPressedKeys(),
        MOVEMENT_SPEED - (Date.now() - this.#lastKeyPressTimestamp)
      );
    }
  }

  reportPressedKeys() {
    this.options.processKeyPress(Array.from(this.#pressedKeys));
    this.#lastKeyPressTimestamp = Date.now();
    this.#timeOut = undefined;
  }
}
