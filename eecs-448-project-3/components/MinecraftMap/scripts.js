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
          {
            block: 'deadBush',
            probabilities: {
              scale: [1, 0],
              cutOff: [13, 3],
            },
            transparent: true,
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
            transparent: false,
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
            transparent: false,
          },
          {
            block: 'dirt',
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
  redFlower: [17],
  yellowFlower: [18],
  whiteFlower: [19],
  deadBush: [20, 21, 22],
  tallGrass: [23],
  sugarCane: [24, 25],
  sandStone: [26],
  sandStones: [27, 28, 29],
  redSandStone: [31],
  redSandStones: [30, 32, 33],
  coalOre: [34],
  ironOre: [35],
  goldOre: [36],
  lapisOre: [37],
  redstoneOre: [38],
  emeraldOre: [39],
  diamondOre: [40],
  snow: [41],
  ice: [42],
  blueIce: [43],
  packedIce: [44],
  cactus: [45],
  blueFlower: [46],
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

    this.texturesCount = Math.max(...Object.values(blocks).flat());

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
      if (activePatch.transparent) {
        const textures = blocks[activePatch.block];
        overlayTextureIndex = textures[pseudoRandomNumber % textures.length];
      } else block = activePatch.block;
    }

    const textures = blocks[block];
    const textureIndex = textures[pseudoRandomNumber % textures.length];

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
