import Promise from 'bluebird';

export default class ImagePixels {
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
