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
   * All properties can sway in either direction by this amount depending on
   * the map seed
   *
   */
  #seedBasedVariation = 0.3;

  #biomeScale = 32;

  #biomeCutOff = 0.25;

  #blockPathCutOff = 0.27;

  #blockPathScale = 4;

  #noiseFunction;

  #biomes = {
    grass: {
      // This biome would be used everywhere by default
      isBaseBiome: true,
      blocks: {
        grass: {
          // This block would be used everywhere within the biome by default
          isBaseBlock: true,
          baseProbabilities: {
            likelihood: [80, 10],
            /*
             * If it's a base block, you shouldn't specify size
             * size: [],
             */
          },
        },
        dirt: {
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
      isBaseBiome: false,
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
      isBaseBiome: false,
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
  };

  #blocks = {
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

  #image;

  values;

  async render() {
    await super.render();

    this.#image = new Image();
    this.#image.src = './static/textures/minecraft.png';
    await new Promise((resolve) =>
      this.#image.addEventListener('load', resolve, { once: true })
    );

    const mutateObject = async (object, callback) =>
      Object.fromEntries(
        await Promise.all(
          Object.entries(object).map(async ([key, value], index) => [
            key,
            await callback(key, value, index),
          ])
        )
      );

    const mutateProbabilities = async (baseProbabilities, seed) =>
      mutateObject(
        baseProbabilities,
        async (_propertyName, propertyValues, propertyIndex) =>
          mutatePropertyValues(propertyValues, `${seed},${propertyIndex}`)
      );

    const mutatePropertyValues = async (propertyValues, seed) =>
      (
        await Promise.all(
          propertyValues.map(async (value, valueIndex) => {
            const randomNumber = await this.getDeterministicRandom(
              `${seed},${valueIndex}`,
              200
            );
            return (
              value * (1 + this.#seedBasedVariation * (randomNumber / 100 - 1))
            );
          })
        )
      ).map(Math.round);

    this.#biomes = await mutateObject(
      this.#biomes,
      async (_biomeName, biomeData, biomeIndex) => ({
        ...biomeData,
        probabilities: await mutateProbabilities(
          biomeData.baseProbabilities,
          biomeIndex
        ),
        blocks: Object.fromEntries(
          await Promise.all(
            Object.entries(biomeData.blocks).map(
              async ([blockName, blockData], blockIndex) => [
                blockName,
                {
                  ...blockData,
                  probabilities: await mutateProbabilities(
                    {
                      ...this.#blocks[blockName].baseProbabilities,
                      ...blockData.baseProbabilities,
                    },
                    `${biomeIndex},${blockIndex}`
                  ),
                },
              ]
            )
          )
        ),
      })
    );

    this.#noiseFunction = makeNoise2D(stringToNumber(this.seed));

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

    const block =
      this.#noiseFunction(
        row / this.#blockPathScale,
        col / this.#blockPathScale
      ) > this.#blockPathCutOff
        ? 1
        : 0;

    const biome =
      this.#noiseFunction(row / this.#biomeScale, col / this.#biomeScale) >
      this.#biomeCutOff
        ? 'stone'
        : 'grass';

    const biomeBlocks = Object.keys(this.#biomes[biome].blocks);
    const biomeBlock = biomeBlocks[block];
    /*
     * Const biomeBlock =
     *   biomeBlocks[pseudoRandomNumber % (biomeBlocks.length - 1)];
     */
    const blockTextures = this.#blocks[biomeBlock].variations;
    const textureIndex =
      blockTextures[pseudoRandomNumber % (blockTextures.length - 1)];

    this.map[row] ??= {};
    this.map[row][col] = {
      backgroundImage: this.#image,
      backgroundImageOptions: [
        this.#textureSize * textureIndex,
        0,
        this.#textureSize,
        this.#textureSize,
      ],
    };
  }
}
