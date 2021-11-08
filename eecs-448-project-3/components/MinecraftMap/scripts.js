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

const biomeProbabilities = [
  /*
   * Two noise functions overlap to create 4 possible biomes
   */
  {
    /*
     * The size of the biomes and the variance
     */
    scale: [64, 16],
    /*
     * The percentage of the screen that would be occupied by the base
     * biome on average and the variance
     */
    cutOff: [50, 10],
  },
  {
    /*
     * Variance is going to be multiplied by a sudo-random float in the range
     * from -1 to 1 and added to the base likelihood
     */
    scale: [64, 16],
    cutOff: [50, 10],
  },
];

const biomes = {
  grass: {
    blocks: {
      dirt: {
        grass: {
          // This block would be used everywhere within the layer by default
          isBaseBlock: true,
          baseProbabilities: {
            likelihood: [80, 10],
            /*
             * If it's a base block, you shouldn't specify size
             * size: [],
             */
          },
        },
        baseProbabilities: {
          // If empty, it uses default probabilities for that block
        },
      },
      sand: {
        baseProbabilities: {},
      },
    },
    baseProbabilities: {
      // [percentage, standard deviation]
      likelihood: [50, 10],
      /*
       * If it's a base biome, you shouldn't specify size
       * size: [],
       */
    },
  },
  sand: {
    blocks: {
      sand: {
        isBaseBlock: true,
        baseProbabilities: {
          likelihood: [80, 10],
        },
      },
      dirt: {
        baseProbabilities: {},
      },
    },
    baseProbabilities: {
      likelihood: [20, 5],
      size: [5, 15],
    },
  },
  stone: {
    blocks: {
      stone: {
        isBaseBlock: true,
        baseProbabilities: {
          likelihood: [80, 10],
        },
      },
      dirt: {
        baseProbabilities: {},
      },
      gravel: {
        baseProbabilities: {},
      },
      granite: {
        baseProbabilities: {},
      },
      diorite: {
        baseProbabilities: {},
      },
    },
    baseProbabilities: {
      likelihood: [30, 15],
      size: [60, 20],
    },
  },
  snow: {
    // TODO: add dry ice, ice and snow textures
    blocks: {
      gravel: {},
    },
  },
};

const blocks = {
  grass: {
    variations: [1, 2, 3, 4],
    baseProbabilities: {
      likelihood: [10, 10],
      size: [30, 20],
    },
  },
  dirt: {
    variations: [5, 6, 7],
    baseProbabilities: {
      likelihood: [10, 10],
      size: [5, 10],
    },
  },
  sand: {
    variations: [8],
    baseProbabilities: {
      likelihood: [10, 10],
      size: [5, 10],
    },
  },
  stone: {
    variations: [9, 10],
    baseProbabilities: {
      likelihood: [10, 10],
      size: [40, 20],
    },
  },
  gravel: {
    variations: [11, 12, 13],
    baseProbabilities: {
      likelihood: [5, 5],
      size: [8, 9],
    },
  },
  granite: {
    variations: [14, 15],
    baseProbabilities: {
      likelihood: [8, 10],
      size: [10, 20],
    },
  },
  diorite: {
    variations: [16, 17],
    baseProbabilities: {
      likelihood: [8, 10],
      size: [10, 20],
    },
  },
};

class MinecraftMap extends Map {
  #mapType = 'minecraft';

  #textureSize = 16;

  #image;

  #getBiomeAtCell;

  values;

  async render() {
    await super.render();

    this.#image = new Image();
    this.#image.src = './static/textures/minecraft.png';
    await new Promise((resolve) =>
      this.#image.addEventListener('load', resolve, { once: true })
    );

    const [biomeMaskBottom, biomeMaskTop] = await Promise.all(
      biomeProbabilities.map(async (baseProbabilities, index) =>
        generateMaskLayer(
          baseProbabilities,
          this.seed,
          index,
          this.getDeterministicRandom.bind(this)
        )
      )
    );

    this.#getBiomeAtCell = (x, y) => {
      const leftBit = biomeMaskBottom(x, y) ? 0 : 1;
      const rightBit = biomeMaskTop(x, y) ? 0 : 1;
      const binaryIndex = `${leftBit}${rightBit}`;
      const decimalIndex = Number.parseInt(binaryIndex, 2);
      return Object.keys(biomes)[decimalIndex];
    };

    console.log(this.#getBiomeAtCell);

    /*
     *This.#biomes = mutateObject(
     *this.#biomes,
     *async (_biomeName, biomeData, biomeIndex) => ({
     *  ...biomeData,
     *})
     *);
     */

    // This.#noiseFunction = makeNoise2D(stringToNumber(this.seed));

    return this;
  }

  /**
   * @function getCellAtCoordinate
   * @param row row of cell at coordinate
   * @param col column of cell at coordinate
   * @memberof MinecraftMap
   */
  getCellAtCoordinate(row, col) {
    if (typeof this.map[row]?.[col] === 'undefined')
      this.generateCell(row, col);
    return this.map[row]?.[col] ?? {};
  }

  /**
   * @function generateCell
   * @param row row for cell gen
   * @param col column for cell gen
   * @memberof MinecraftMap
   */
  async generateCell(row, col) {
    const pseudoRandomNumber = await this.getDeterministicRandom(
      `${row},${col}`,
      Number.MAX_SAFE_INTEGER
    );

    const biome = biomes[this.#getBiomeAtCell(row, col)];
    const block = blocks[Object.keys(biome.blocks)[0]];
    const textures = block.variations;
    const textureIndex = textures[pseudoRandomNumber % textures.length];

    this.map[row] ??= {};
    this.map[row][col] = {
      backgroundImage: this.#image,
      backgroundImageOptions: [
        this.#textureSize * (textureIndex - 1),
        0,
        this.#textureSize,
        this.#textureSize,
      ],
    };
  }
}
