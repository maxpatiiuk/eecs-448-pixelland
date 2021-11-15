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
           * Can render only one of them at a time, with the first active patch
           * taking precedence
           */
          {
            block: 'yellowFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
          },
          {
            block: 'redFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
          },
          {
            block: 'whiteFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
          },
          {
            block: 'blueFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [10, 3],
            },
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
          },
          {
            block: 'sugarCane',
            probabilities: {
              scale: [5, 2],
              cutOff: [15, 5],
            },
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
          },
          {
            block: 'deadBush',
            probabilities: {
              scale: [1, 0],
              cutOff: [13, 3],
            },
          },
        ],
      },
      middle: {
        block: 'sandStone',
        patches: [
          {
            block: 'sandStones',
            probabilities: {
              scale: [5, 2],
              cutOff: [20, 5],
            },
          },
        ],
      },
      bottom: {
        block: 'redSandStone',
        patches: [
          {
            block: 'redSandStones',
            probabilities: {
              scale: [5, 2],
              cutOff: [20, 5],
            },
          },
          {
            block: 'dirt',
            probabilities: {
              scale: [2, 1],
              cutOff: [16, 4],
            },
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
          },
          {
            block: 'diorite',
            probabilities: {
              scale: [4, 2],
              cutOff: [20, 5],
            },
          },
          {
            block: 'granite',
            probabilities: {
              scale: [4, 2],
              cutOff: [20, 5],
            },
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
            block: 'redstoneOre',
            probabilities: {
              scale: [4, 1],
              cutOff: [14, 3],
            },
          },
          {
            block: 'lapisOre',
            probabilities: {
              scale: [4, 1],
              cutOff: [10, 3],
            },
          },
          {
            block: 'emeraldOre',
            probabilities: {
              scale: [2, 1],
              cutOff: [5, 1],
            },
          },
          {
            block: 'diamondOre',
            probabilities: {
              scale: [4, 2],
              cutOff: [10, 3],
            },
          },
        ],
      },
    },
  },
  snow: {
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
          },
          {
            block: 'redFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [6, 3],
            },
          },
          {
            block: 'whiteFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [6, 3],
            },
          },
          {
            block: 'blueFlower',
            probabilities: {
              scale: [2, 1],
              cutOff: [0, 3],
            },
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
  grass: {
    /*
     * The positions of the textures for this block in the texture file
     * If multiple are specified, a single one would be selected pseudo-randomly
     */
    variations: [0, 1, 2, 3],
    /*
     * If transparent, base block is rendered behind them
     */
    transparent: false,
  },
  dirt: {
    variations: [4, 4, 6],
    transparent: false,
  },
  sand: {
    variations: [7],
    transparent: false,
  },
  stone: {
    variations: [8, 9],
    transparent: false,
  },
  gravel: {
    variations: [10, 11, 12],
    transparent: false,
  },
  granite: {
    variations: [13, 14],
    transparent: false,
  },
  diorite: {
    variations: [15, 16],
    transparent: false,
  },
  redFlower: {
    variations: [17],
    transparent: true,
  },
  yellowFlower: {
    variations: [18],
    transparent: true,
  },
  whiteFlower: {
    variations: [19],
    transparent: true,
  },
  deadBush: {
    variations: [20, 21, 22],
    transparent: true,
  },
  tallGrass: {
    variations: [23],
    transparent: true,
  },
  sugarCane: {
    variations: [24, 25],
    transparent: true,
  },
  sandStone: {
    variations: [26],
    transparent: false,
  },
  sandStones: {
    variations: [27, 28, 29],
    transparent: false,
  },
  redSandStone: {
    variations: [31],
    transparent: false,
  },
  redSandStones: {
    variations: [30, 32, 33],
    transparent: false,
  },
  coalOre: {
    variations: [34],
    transparent: false,
  },
  ironOre: {
    variations: [35],
    transparent: false,
  },
  goldOre: {
    variations: [36],
    transparent: false,
  },
  lapisOre: {
    variations: [37],
    transparent: false,
  },
  redstoneOre: {
    variations: [38],
    transparent: false,
  },
  emeraldOre: {
    variations: [39],
    transparent: false,
  },
  diamondOre: {
    variations: [40],
    transparent: false,
  },
  snow: {
    variations: [41],
    transparent: false,
  },
  ice: {
    variations: [42],
    transparent: false,
  },
  blueIce: {
    variations: [43],
    transparent: false,
  },
  packedIce: {
    variations: [44],
    transparent: false,
  },
  cactus: {
    variations: [45],
    transparent: true,
  },
  blueFlower: {
    variations: [46],
    transparent: true,
  },
  testFlower: {
    variations: [46],
    transparent: true,
  },
};

class MinecraftMap extends Map {
  #getBiomeAtCell;

  #getHeightAtCell;

  #biomes;

  texturesSrc = './static/textures/minecraft.png';

  textureSize = 16;

  texturesCount;

  textures;

  async render() {
    await super.render();

    this.texturesCount = Math.max(
      ...Object.values(blocks).flatMap(({ variations }) => variations)
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

    const invertLeftBit = await this.getDeterministicRandom('1', 2);
    const invertRightBit = await this.getDeterministicRandom('2', 2);
    const reverseBits = await this.getDeterministicRandom('3', 2);
    const bitToInt = (bit) => (bit ? 1 : 0);
    this.#getBiomeAtCell = (x, y) => {
      const leftBit = bitToInt(biomeMaskBottom(x, y));
      const invertedLeftBit = invertLeftBit ? bitToInt(!leftBit) : leftBit;
      const rightBit = bitToInt(biomeMaskTop(x, y));
      const invertedRightBit = invertRightBit ? bitToInt(!rightBit) : rightBit;
      const binaryIndex = `${invertedLeftBit}${invertedRightBit}`;
      const reversedIndex = reverseBits
        ? binaryIndex.split('').reverse().join('')
        : binaryIndex;
      const decimalIndex = Number.parseInt(reversedIndex, 2);
      return Object.keys(biomes)[decimalIndex];
    };

    this.#biomes = await mutateObject(
      biomes,
      async (_biomeName, biomeData, biomeIndex) => ({
        ...biomeData,
        layers: await mutateObject(
          biomeData.layers,
          async (_layerName, layerData, layerIndex) => ({
            ...layerData,
            patches: await Promise.all(
              layerData.patches.map(
                async ({ probabilities, ...patchData }, patchIndex) => ({
                  ...patchData,
                  maskLayer: await createMaskLayer(
                    probabilities,
                    `${biomeIndex},${layerIndex},${patchIndex}`
                  ),
                })
              )
            ),
          })
        ),
      })
    );

    this.#getHeightAtCell = await createMaskLayer(heightLayer);

    return this;
  }

  /**
   * @function generateCell
   * @param col column for cell gen
   * @param row row for cell gen
   * @memberof MinecraftMap
   */
  async generateCell(col, row) {
    const pseudoRandomNumber = await this.getDeterministicRandom(
      `${col},${row}`,
      Number.MAX_SAFE_INTEGER
    );

    const biome = this.#biomes[this.#getBiomeAtCell(col, row)];

    const height = this.#getHeightAtCell(col, row);
    const layers = Object.keys(biome.layers);
    const layerSize = 100 / layers.length;
    const layer = biome.layers[layers[Math.floor(height / layerSize)]];
    let block = layer.block;

    const activePatch = layer.patches.find(({ maskLayer }) =>
      maskLayer(col, row)
    );

    let overlayTextureIndex = undefined;
    if (typeof activePatch !== 'undefined') {
      const texture = blocks[activePatch.block];
      if (texture.transparent) {
        overlayTextureIndex =
          texture.variations[pseudoRandomNumber % texture.variations.length];
      } else block = activePatch.block;
    }

    const textures = blocks[block];
    const textureIndex =
      textures.variations[pseudoRandomNumber % textures.variations.length];

    // Darken deeper blocks
    const depth = Math.round((100 - (height % (100 / 3)) * 3) * 20) / 100;

    this.map[col] ??= {};
    this.map[col][row] = {
      backgroundImage: this.textures[textureIndex],
      // TODO: experiment with different depth colors for different biomes
      backgroundColor: `rgba(1, 1, 1, ${depth}%)`,
      ...(typeof overlayTextureIndex === 'number'
        ? {
            backgroundOverlayOptions: this.textures[overlayTextureIndex],
          }
        : {}),
    };
  }
}
