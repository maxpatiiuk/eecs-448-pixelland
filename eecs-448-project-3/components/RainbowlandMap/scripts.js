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

  async generateCell(row, col) {
    const random = this.getDeterministicRandom.bind(this, `${row},${col}`);
    const baseHue = clampInt(360, stringToNumber(this.seed.slice(0, 5)));
    const hue = clampInt(360, baseHue + row * 2 - col + (await random(50)));
    const saturation =
      20 + clampInt(40, Math.floor(row / 2 + col / 2 + (await random(5))));
    this.map[row] ??= {};
    this.map[row][col] = {
      backgroundColor: `hsl(${hue}deg, ${saturation}%, 50%)`,
    };
  }
}
