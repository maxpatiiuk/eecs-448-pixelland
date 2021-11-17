/*
 * The name of this view
 * Later, to render this view, call:
 * New Controls(options).render(this.container)
 */

/**
 * Sets movement keys
 * @constant
 * @type {Set}
 * @param {String} up key up
 * @param {String} down key down
 * @param {String} left key left
 * @param {String} right key right
 * @memberof Controls
 * @public
 */
const movementKeys = new Set(['up', 'down', 'left', 'right']);

/**
 * Sets zoom keys
 * @constant
 * @type {Set}
 * @param {String} zoomReset zoom reset key
 * @param {String} zoomOut zoom out key
 * @param {String} zoomIn zoom in key
 * @memberof Controls
 * @public
 */
const zoomKeys = new Set(['zoomIn', 'zoomOut', 'zoomReset']);

/**
 * Sets inventory keys
 * @constant
 * @type {Set}
 * @param {String} slotN nth slot [0-9]
 * @memberof Controls
 * @public
 */
const inventoryKeys = new Set([
  'slot0',
  'slot1',
  'slot2',
  'slot3',
  'slot4',
  'slot5',
  'slot6',
  'slot7',
  'slot8',
  'slot9',
]);

/**
 * Maps keys with the in-game function key equivalent
 * @constant
 * @param {json} keys
 * @param {String} keys.KeyW "up"
 * @param {String} keys.KeyS "down"
 * @param {String} keys.KeyA "left"
 * @param {String} keys.KeyD "right"
 * @param {String} keys.ArrowUp "up"
 * @param {String} keys.ArrowDown "down"
 * @param {String} keys.ArrowLeft "left"
 * @param {String} keys.ArrowRight "right"
 * @param {String} keys.KeyK "up"
 * @param {String} keys.KeyJ "down"
 * @param {String} keys.KeyH "left"
 * @param {String} keys.KeyL "right"
 * @param {String} keys.Escape "escape"
 * @memberof Controls
 * @public
 */
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
  Minus: 'zoomOut',
  Equal: 'zoomIn',
  KeyO: 'zoomReset',
  Digit0: 'slot0',
  Digit1: 'slot1',
  Digit2: 'slot2',
  Digit3: 'slot3',
  Digit4: 'slot4',
  Digit5: 'slot5',
  Digit6: 'slot6',
  Digit7: 'slot7',
  Digit8: 'slot8',
  Digit9: 'slot9',
};

/**
 * Maps keys toggle
 * @constant
 * @param {json} toggleKey
 * @param {String} toggleKey.Escape "escape"
 * @memberof Controls
 * @public
 */
const toggleKeys = {
  Escape: 'escape',
  KeyE: 'inventory',
};

/**
 * Handle game control keys
 * @class Controls
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class Controls extends Component {
  /**
   * @type {Set} pressedKeys
   * @memberof Controls
   * @public
   */
  #pressedKeys = new Set();

  // This callback is set in CanvasView
  afterMovementChange = undefined;

  constructor(options) {
    super({
      ...options,
      hasContainer: false,
    });
  }

  /**
   * Handle render-related functionality for controls
   * @async
   * @function render
   * @memberof Controls
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

  /**
   * @function handleKeyPress
   * @memberof Controls
   * @param {type, code}
   */
  handleKeyPress({ type, code }) {
    if (code in toggleKeys) {
      if (type === 'keyup') this.options.handleKeyToggle(toggleKeys[code]);
      return;
    }

    if (!(code in keyMapper)) return;

    const action = keyMapper[code];

    this.#pressedKeys[type === 'keydown' ? 'add' : 'delete'](action);

    if (DEVELOPMENT) console.log(Array.from(this.#pressedKeys));

    if (type === 'keydown' && zoomKeys.has(action)) {
      if (action === 'zoomReset') cellSize = INITIAL_CELL_SIZE;
      else if (action === 'zoomIn' && cellSize < MAX_CELL_SIZE)
        cellSize += CELL_SIZE_STEP;
      else if (action === 'zoomOut' && cellSize > MIN_CELL_SIZE)
        cellSize -= CELL_SIZE_STEP;
      if (DEVELOPMENT) console.log(`Cell size: ${cellSize}`);
      this.options.handleZoom();
      return;
    }

    if (type === 'keydown' && inventoryKeys.has(action))
      this.options.handleToolbarSelected(Number.parseInt(action.slice(4)));

    if (this.#pressedKeys.has('up') && this.#pressedKeys.has('down'))
      this.#pressedKeys.delete('down');
    if (this.#pressedKeys.has('left') && this.#pressedKeys.has('right'))
      this.#pressedKeys.delete('left');

    this.afterMovementChange?.(this.getMovementDirection());
  }

  /**
   * @function getMovementDirection
   * @memberof Controls
   */
  getMovementDirection() {
    const pressedKeys = new Set(
      Array.from(this.#pressedKeys).filter((key) => movementKeys.has(key))
    );

    const movementDirection = [0, 0];

    if (pressedKeys.has('left')) movementDirection[0] = -1;
    else if (pressedKeys.has('right')) movementDirection[0] = 1;

    if (pressedKeys.has('up')) movementDirection[1] = -1;
    else if (pressedKeys.has('down')) movementDirection[1] = 1;

    return movementDirection;
  }
}
