const mutateObject = async (object, callback) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(object).map(async ([key, value], index) => [
        key,
        await callback(key, value, index),
      ])
    )
  );

async function generateMaskLayer(
  baseProbabilities,
  baseSeed,
  seed,
  randomGenerator
) {
  const { scale, cutOff } = await mutateProbabilities(
    baseProbabilities,
    seed,
    randomGenerator
  );
  const noiseFunction = makeNoise2D(stringToNumber(`${baseSeed}${seed}`));
  // Generate either elevation map or mask layer
  return typeof cutOff === 'undefined'
    ? (x, y) => noiseFunction(x / scale, y / scale) * 100
    : (x, y) => noiseFunction(x / scale, y / scale) * 100 < cutOff;
}

const mutateProbabilities = async (baseProbabilities, seed, randomGenerator) =>
  mutateObject(
    baseProbabilities,
    async (_propertyName, propertyValues, propertyIndex) =>
      mutateProbability(
        propertyValues,
        `${seed},${propertyIndex}`,
        randomGenerator
      )
  );

const precision = 10_000;

async function mutateProbability(propertyValues, seed, randomGenerator) {
  const randomNumber = await randomGenerator(seed, precision * 2);
  const multiplier = (randomNumber - precision) / precision;
  return Math.round(propertyValues[0] + propertyValues[1] * multiplier);
}
