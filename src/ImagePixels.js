import Promise from 'bluebird';

/**
 * @private
 * A class that wraps a canvas context and allows you to read individual pixels as rgba values. 
 */ 
export default class ImagePixels {
  /**
   * @private
   * @param {Image} img 
   * @param {number} [width = image width] width value if you want to resize the image
   * @param {number} [yStretch = 1] how much you would like to stretch the height compared to the width
   * @param {Canvas} [mockCanvas] mock canvas used only for testing with 'canvas-prebuilt'
   */
  constructor(img, width, yStretch = 1, mockCanvas) {
    const aspectRatio = (img.height / img.width) * yStretch;
    this.width = width || img.width;
    this.height = this.width * aspectRatio;
    const canvas = mockCanvas || document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
    this.context.drawImage(img, 0, 0, this.width, this.height);
  }

  /**
   * @private
   * Get an Object with keys r, g, b, a representing the pixel at point i, j
   * @param {number} i 
   * @param {number} j
   * @returns {Object} with r, g, b, a values
   */
  get(i, j) {
    const data = this.context.getImageData(i, j, 1, 1).data;
    return {
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3] / 255,
    };
  }
}

export const imagePixelsPromise = (img, width, stretch) => new Promise((resolve, reject) => {
  img.onload = () => {
    resolve(new ImagePixels(img, width, stretch));
  };
  img.onerror = (err) => {
    reject(err);
  };
});
