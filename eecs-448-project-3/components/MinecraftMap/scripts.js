/*
 * The name of this view
 * Later, to render this view, call:
 * New MinecraftMap(options).render(this.container)
 */
/**
 * Draw current player / NPC
 * @class MinecraftMap
 * @constructor
 * @param options
 * @extends Component
 * @public
 */
class MinecraftMap extends Map {
  #mapType = 'minecraft';

  #textureSize = 16;

  /*
   * All properties can sway in either direction by this ammount depending on
   * the map seed
   *
   */
  #seedBasedVariation = 0.2;

  #biomes = {
    grass: {
      // This biome would be used everywhere by default
      isBaseBiome: true,
      baseBlock: 'grass',
      // Other blocks that may occur in the biome
      childrenBlocks: ['dirt', 'sand'],
      blocks: {
        grass: {
          // This block would be used everywhere within the biome by default
          isBaseBlock: true,
          // If empty, it uses default probabilities for that block
          baseProbabilities: {},
        }
      }
      baseProbabilities: {
        // [percentage, standard deviation]
        likelihood: [50, 10],
        size: [40, 10],
      },
    },
    sand: {
      isBaseBiome: false,
      baseBlock: 'sand',
      childrenBlocks: [],
      baseProbabilities: {
        likelihood: [20, 5],
        size: [5, 15],
      },
    },
    stone: {
      isBaseBiome: false,
      baseBlock: 'stone',
      childrenBlocks: ['dirt', 'gravel', 'granite', 'diorite'],
      baseProbabilities: {
        likelihood: [30, 15],
        size: [60, 20],
      },
    },
  };

  #blocks = {
    grass: {
      variations: [1, 2, 3, 4],
      isAnimated: false,
      baseProbabilities: {
        // FIXME: specify this
      },
    },
    dirt: {
      variations: [5, 6, 7],
      isAnimated: false,
    },
    sand: {
      variations: [8],
      isAnimated: false,
    },
    stone: {
      variations: [9, 10],
      isAnimated: false,
    },
    gravel: {
      variations: [11, 12, 13],
      isAnimated: false,
    },
    granite: {
      variations: [14, 15],
      isAnimated: false,
    },
    diorite: {
      variations: [16, 17],
      isAnimated: false,
    },
  };

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
