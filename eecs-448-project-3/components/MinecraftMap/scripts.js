/*
 * The name of this view
 * Later, to render this view, call:
 * new MinecraftMap(options).render(this.container)
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

const heightLayer = {
  scale: [10, 5],
};

const biomes = {
  grass: {
    layers: {
      /*
       * Each cell has a height between 0 and 100
       * You can define any number of layers. Names do not matter
       * If you define 3 layers, heights 0-33 would correspond to the bottom
       * layer, 33-66 to the middle layer and 66-100 to the top layer.
       *
       * Edges of each layer would be darkened to simulate a shadow
       */
      top: {
        // Block this layer would consist of
        block: 'grass',
        patches: [
          /*
           * Patches of ores or other entities
           * If transparent, base block is rendered behind them
           * Can render only one of them at a time, with the first active patch
           * taking precedence
           */
          {
            block: 'yellowFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
            transparent: true,
          },
          {
            block: 'redFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
            transparent: true,
          },
          {
            block: 'whiteFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
            transparent: true,
          },
          {
            block: 'blueFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
            transparent: true,
          },
        ],
      },
      middle: {
        block: 'grass',
        patches: [
          {
            block: 'tallGrass',
            probabilities: {
              scale: [5, 2],
              cutOff: [15, 5],
            },
            transparent: true,
          },
          {
            block: 'sugarCane',
            probabilities: {
              scale: [5, 2],
              cutOff: [15, 5],
            },
            transparent: true,
          },
        ],
      },
      bottom: {
        block: 'dirt',
        patches: [
          {
            block: 'stone',
            probabilities: {
              scale: [2, 1],
              cutOff: [16, 4],
            },
            transparent: false,
          },
        ],
      },
    },
  },
  sand: {
    layers: {
      top: {
        block: 'sand',
        patches: [
          {
            block: 'cactus',
            probabilities: {
              scale: [1, 0],
              cutOff: [13, 3],
            },
            transparent: true,
          },
        ],
      },
      middle: {
        block: 'sand',
        patches: [
          {
            block: 'dryWood',
            probabilities: {
              scale: [1, 0],
              cutOff: [13, 3],
            },
            transparent: true,
          },
        ],
      },
      bottom: {
        block: 'sandStone',
        patches: [
          {
            block: 'stone',
            probabilities: {
              scale: [2, 1],
              cutOff: [16, 4],
            },
            transparent: false,
          },
        ],
      },
    },
  },
  stone: {
    layers: {
      top: {
        block: 'stone',
        patches: [
          {
            block: 'gravel',
            probabilities: {
              scale: [4, 2],
              cutOff: [20, 5],
            },
            transparent: false,
          },
          {
            block: 'diorite',
            probabilities: {
              scale: [4, 2],
              cutOff: [20, 5],
            },
            transparent: false,
          },
          {
            block: 'granite',
            probabilities: {
              scale: [4, 2],
              cutOff: [20, 5],
            },
            transparent: false,
          },
        ],
      },
      middle: {
        block: 'stone',
        patches: [
          {
            block: 'coalOre',
            probabilities: {
              scale: [4, 2],
              cutOff: [20, 5],
            },
          },
          {
            block: 'ironOre',
            probabilities: {
              scale: [4, 1],
              cutOff: [17, 3],
            },
          },
          {
            block: 'goldOre',
            probabilities: {
              scale: [4, 1],
              cutOff: [17, 3],
            },
          },
        ],
      },
      bottom: {
        block: 'stone',
        patches: [
          {
            block: 'redstone',
            probabilities: {
              scale: [4, 1],
              cutOff: [14, 3],
            },
          },
          {
            block: 'lapis',
            probabilities: {
              scale: [4, 1],
              cutOff: [10, 3],
            },
          },
          {
            block: 'emerald',
            probabilities: {
              scale: [2, 1],
              cutOff: [5, 1],
            },
          },
          {
            block: 'diamond',
            probabilities: {
              scale: [10, 5],
              cutOff: [10, 3],
            },
          },
        ],
      },
    },
  },
  snow: {
    // TODO: add dry ice, ice and snow textures
    layers: {
      top: {
        block: 'snow',
        patches: [
          {
            block: 'yellowFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [6, 3],
            },
            transparent: true,
          },
          {
            block: 'redFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [6, 3],
            },
            transparent: true,
          },
          {
            block: 'whiteFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [6, 3],
            },
            transparent: true,
          },
          {
            block: 'blueFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [0, 3],
            },
            transparent: true,
          },
        ],
      },
      middle: {
        block: 'snow',
        patches: [
          {
            block: 'tallGrass',
            probabilities: {
              scale: [6, 2],
              cutOff: [13, 5],
            },
            transparent: true,
          },
        ],
      },
      bottom: {
        block: 'ice',
        patches: [
          {
            block: 'blueIce',
            probabilities: {
              scale: [20, 5],
              cutOff: [27, 3],
            },
          },
          {
            block: 'packedIce',
            probabilities: {
              scale: [20, 5],
              cutOff: [27, 3],
            },
          },
        ],
      },
    },
  },
};

const blocks = {
  /*
   * The positions of the textures for this block in the texture file
   * If multiple are specified, a single one would be selected pseudo-randomly
   */
  grass: [0, 1, 2, 3],
  dirt: [4, 4, 6],
  sand: [7],
  stone: [8, 9],
  gravel: [10, 11, 12],
  granite: [13, 14],
  diorite: [15, 16],
};

class MinecraftMap extends Map {
  #mapType = 'minecraft';

  #textureSize = 16;

  #image;

  #getBiomeAtCell;

  #getHeightAtCell;

  values;

  async render() {
    await super.render();

    this.#image = new Image();
    this.#image.src = './static/textures/minecraft.png';
    await new Promise((resolve) =>
      this.#image.addEventListener('load', resolve, { once: true })
    );

    const createMaskLayer = async (baseProbabilities, index = '') =>
      generateMaskLayer(
        baseProbabilities,
        this.seed,
        index,
        this.getDeterministicRandom.bind(this)
      );
    const [biomeMaskBottom, biomeMaskTop] = await Promise.all(
      biomeProbabilities.map(async (baseProbabilities, index) =>
        createMaskLayer(baseProbabilities, index)
      )
    );

    this.#getBiomeAtCell = (x, y) => {
      const leftBit = biomeMaskBottom(x, y) ? 0 : 1;
      const rightBit = biomeMaskTop(x, y) ? 0 : 1;
      const binaryIndex = `${leftBit}${rightBit}`;
      const decimalIndex = Number.parseInt(binaryIndex, 2);
      return Object.keys(biomes)[decimalIndex];
    };

    this.#getHeightAtCell = await createMaskLayer(heightLayer);

    console.log(this.#getHeightAtCell);

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

    const height = this.#getHeightAtCell(row, col);
    const layers = Object.keys(biome.layers);
    const layerSize = 100 / layers.length;
    const layer = layers[Math.floor(height / layerSize)];
    const textures = blocks[biome.layers[layer].block];
    const textureIndex = textures[pseudoRandomNumber % textures.length];

    // Darken deeper blocks
    const depth = (100 - (height % (100 / 3)) * 3) * 0.2;

    this.map[row] ??= {};
    this.map[row][col] = {
      backgroundImage: this.#image,
      backgroundImageOptions: [
        this.#textureSize * textureIndex,
        0,
        this.#textureSize,
        this.#textureSize,
      ],
      backgroundColor: `rgba(1, 1, 1, ${depth}%)`,
    };
  }
}
