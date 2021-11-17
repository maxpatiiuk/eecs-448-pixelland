/**
 * Crypt functions
 * @module Crypto
 */

/*
 * Generate 64-bit hash from a string
 *
 * Source:
 * https://stackoverflow.com/a/43383990/8584605
 */
/**
 * Renders a defined view into a container. Passes in necessary, predefined
 * render parameters.
 * @async
 * @function getHash
 * @param string String to encode
 * @param algorithm Algorithm to use
 */
async function getHash(string, algorithm = 'SHA-256') {
  const stringBuf = new TextEncoder().encode(string);
  return crypto.subtle.digest(algorithm, stringBuf).then((hash) => {
    // Convert hash from ArrayBuffer to hex string
    let result = '';
    const view = new DataView(hash);
    for (let i = 0; i < hash.byteLength; i += 4) {
      result += `00000000${view.getUint32(i).toString(16)}`.slice(-8);
    }
    return result;
  });
}

/*
 * String to number
 *
 * Source:
 * https://stackoverflow.com/a/15710692/8584605
 *
 */
const stringToNumber = (string) =>
  string.split('').reduce((total, character) => {
    const newTotal = (total << 5) - total + character.charCodeAt(0);
    return newTotal & newTotal;
  }, 0);

const clampInt = (max, value) =>
  value % max < 0 ? max + (value % max) : value % max;
