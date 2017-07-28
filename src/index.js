import Promise from 'bluebird';
import { imagePixelsPromise } from 'Src/ImagePixels.js';

export const isWhiteOrTransparent = (r, g, b, a) => (a < 0.1) || (r > 250 && g > 250 && b > 250);

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

export const imageFromFile = (file) => {
  const img = new Image();
  img.file = file;
  const reader = new FileReader();
  reader.onload = (function onLoad(aImg) { return function assignSrc(e) { aImg.src = e.target.result; }; }(img));
  reader.readAsDataURL(file);
  return img;
};

export const fileToPixels = (file, width, stretch) => {
  const img = imageFromFile(file);
  img.crossOrigin = 'Anonymous';
  return imagePixelsPromise(img, width, stretch);
};

export const urlToPixels = (url, width, stretch) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.src = url;
  return imagePixelsPromise(img, width, stretch);
};

export const fileToText = (file, width, stretch, options) => fileToPixels(file, width, stretch).then(imgPixels => pixelsToText(imgPixels, options));

export const urlToText = (url, width, stretch, options) => urlToPixels(url, width, stretch).then(imgPixels => pixelsToText(imgPixels, options));

