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
};

class Controls extends Component {
  #pressedKeys = new Set();

  #lastKeyPressTimestamp = 0;

  #isMovementDiagonal = false;

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

    const movementSpeed = this.#isMovementDiagonal
      ? DIAGONAL_MOVEMENT_SPEED
      : MOVEMENT_SPEED;

    if (this.#lastKeyPressTimestamp + movementSpeed < Date.now())
      this.reportPressedKeys();
    else {
      if (typeof this.#timeOut !== 'undefined') clearTimeout(this.#timeOut);
      this.#timeOut = setTimeout(
        () => this.reportPressedKeys(),
        movementSpeed - (Date.now() - this.#lastKeyPressTimestamp)
      );
    }
  }

  reportPressedKeys() {
    const pressedKeys = Array.from(this.#pressedKeys);
    this.#isMovementDiagonal =
      pressedKeys.filter((key) => movementKeys.has(key)).length === 2;
    this.options.processKeyPress(pressedKeys, this.#isMovementDiagonal);
    this.#lastKeyPressTimestamp = Date.now();
    this.#timeOut = undefined;
  }
}
