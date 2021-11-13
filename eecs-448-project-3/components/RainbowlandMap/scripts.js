/*
 * The name of this view
 * Later, to render this view, call:
 * New RainbowlandMap(options).render(this.container)
 */
/**
 * Draw current player / NPC
 * @class RainbowlandMap
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class RainbowlandMap extends Map {
  mapType = 'rainbowland';

  async generateCell(col, row) {
    const random = this.getDeterministicRandom.bind(this, `${col},${row}`);
    const baseHue = clampInt(360, stringToNumber(this.seed.slice(0, 5)));
    const hue = clampInt(360, baseHue + col * 2 - row + (await random(50)));
    const saturation =
      20 + clampInt(40, Math.floor(col / 2 + row / 2 + (await random(5))));
    const isColorChanger = (await random(1000)) < 1;
    this.map[col] ??= {};
    this.map[col][row] = {
      backgroundColor: `hsl(${
        isColorChanger ? (hue + 180) % 360 : hue
      }deg, ${saturation}%, 50%)`,
      ...(isColorChanger
        ? { onStep: this.randomTeleport.bind(this, [col, row]) }
        : {}),
    };
  }

  async randomTeleport([col, row]) {
    if (DEVELOPMENT) console.log('Teleporting...');

    const random = this.getDeterministicRandom.bind(this, `${col},${row}`);
    this.map = [];
    this.options.setCoordinates(
      col + ((await random(100)) - 50),
      row + ((await random(100)) - 50)
    );
  }
}
