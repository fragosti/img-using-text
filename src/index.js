import Promise from 'bluebird';
import { imagePixelsPromise } from './ImagePixels.js';

/**
 * Simple estimation for whether an rgba value is white or transparent
 * @param {number} r red
 * @param {number} g green
 * @param {number} b blue
 * @param {number} a alpha
 * @returns {boolean}
 */
export const isWhiteOrTransparent = (r, g, b, a) => (a < 0.1) || (r > 250 && g > 250 && b > 250);

/**
 * Convert from ImagePixels to text
 * @param {ImagePixels} imgPixels instance of ImagePixels containing image information
 * @param {Object} options options object
 * @param {boolean} [options.async = false] whether to wrap the work for every row in a setTimeout
 * @param {function} [options.charForPixel = return 'x' if !isWhiteOrTransparent else ' '] the function to call to convert from an {r, g, b, a} object to a character or text.
 * @returns {string|Promise} the resulting text if not async, a Promise otherwise
 */
export const pixelsToText = (imgPixels, options) => {
  const { charForPixel, async } = Object.assign({}, {
    async: false,
    charForPixel: ({ r, g, b, a }) => {
      if (!isWhiteOrTransparent(r, g, b, a)) {
        return 'x';
      }
      return ' ';
    },
  }, options);
  const chars = [];
  let charIndex = 0;
  const handleRow = (i) => {
    if (i !== 0) {
      chars.push('\n');
    }
    for (let j = 0; j < imgPixels.width; j++) {
      chars.push(charForPixel(imgPixels.get(j, i), charIndex));
      charIndex += 1;
    }
  };
  if (async) {
    const promises = [];
    for (let i = 0; i < imgPixels.height; i++) {
      promises.push(new Promise((resolve) => {
        setTimeout(() => {
          handleRow(i);
          resolve();
        }, 0);
      }));
    }
    return Promise.all(promises).then(() => chars.join(''));
  }
  for (let i = 0; i < imgPixels.height; i++) {
    handleRow(i);
  }
  return chars.join('');
};

/**
 * Create an Image object from a File object
 * @param {File} file the file (from an <input/> for example)
 * @returns {Image}
 */
export const imageFromFile = (file) => {
  const img = new Image();
  img.file = file;
  const reader = new FileReader();
  reader.onload = (function onLoad(aImg) { return function assignSrc(e) { aImg.src = e.target.result; }; }(img));
  reader.readAsDataURL(file);
  return img;
};

/**
 * Given a File it returns an ImagePixels Promise
 * @param {File} file
 * @param {number} [width = image width] width value if you want to resize the image
 * @param {number} [stretch = 1] how much you would like to stretch the height compared to the width
 * @returns {Promise} a bluebird promise
 */
export const fileToPixels = (file, width, stretch) => {
  const img = imageFromFile(file);
  img.crossOrigin = 'Anonymous';
  return imagePixelsPromise(img, width, stretch);
};

/**
 * Given a URL it returns an ImagePixels Promise
 * @param {string} url url of the image (needs to allows CORS)
 * @param {number} [width = image width] width value if you want to resize the image
 * @param {number} [stretch = 1] how much you would like to stretch the height compared to the width
 * @returns {Promise} a bluebird promise
 */
export const urlToPixels = (url, width, stretch) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  return imagePixelsPromise(img, width, stretch);
};

/**
 * Given a File containing an image, convert it to a text representation.
 * @param {File} file
 * @param {number} [width = image width] width value if you want to resize the image
 * @param {number} [stretch = 1] how much you would like to stretch the height compared to the width
 * @param {Object} options options object
 * @param {boolean} [options.async = false] whether to wrap the work for every row in a setTimeout
 * @param {function} [options.charForPixel = return 'x' if !isWhiteOrTransparent else ' '] the function to call to convert from an {r, g, b, a} object to a character or text.
 * @return {Promise} a promise that resolves to an ImagePixels instance
 */
export const fileToText = (file, width, stretch, options) => fileToPixels(file, width, stretch).then(imgPixels => pixelsToText(imgPixels, options));

/**
 * Given a File containing an image, convert it to a text representation.
 * @param {string} url url of the image (needs to allows CORS)
 * @param {number} [width = image width] width value if you want to resize the image
 * @param {number} [stretch = 1] how much you would like to stretch the height compared to the width
 * @param {Object} options options object
 * @param {boolean} [options.async = false] whether to wrap the work for every row in a setTimeout
 * @param {function} [options.charForPixel = return 'x' if !isWhiteOrTransparent else ' '] the function to call to convert from an {r, g, b, a} object to a character or text.
 * @return {Promise} a promise that resolves to an ImagePixels instance
 */
export const urlToText = (url, width, stretch, options) => urlToPixels(url, width, stretch).then(imgPixels => pixelsToText(imgPixels, options));

