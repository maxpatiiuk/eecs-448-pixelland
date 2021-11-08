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
      // TODO: implement flowers
      top: 'grass',
      middle: 'dirt',
      bottom: 'stone',
    },
  },
  sand: {
    layers: {
      top: 'sand',
      // TODO: implement water
      middle: 'sand',
      bottom: 'sand',
    },
  },
  stone: {
    layers: {
      // TODO: put ores here at certain places
      top: 'stone',
      middle: 'stone',
      bottom: 'stone',
    },
  },
  snow: {
    // TODO: add dry ice, ice and snow textures
    layers: {
      top: 'gravel',
      middle: 'gravel',
      bottom: 'gravel',
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
    const block = blocks[biome.layers[layer]];
    const textures = block.variations;
    const textureIndex = textures[pseudoRandomNumber % textures.length];

    // Darken deeper blocks
    const depth = (100 - (height % (100 / 3)) * 3) * 0.2;

    this.map[row] ??= {};
    this.map[row][col] = {
      backgroundImage: this.#image,
      backgroundImageOptions: [
        this.#textureSize * (textureIndex - 1),
        0,
        this.#textureSize,
        this.#textureSize,
      ],
      backgroundColor: `rgba(1, 1, 1, ${depth}%)`,
    };
  }
}
