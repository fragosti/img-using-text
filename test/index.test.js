import fs from 'fs';
import { exampleText } from './example.js';
import Canvas from 'canvas-prebuilt';
import { isWhiteOrTransparent, pixelsToText } from '../src/index.js';
import ImagePixels from '../src/ImagePixels';


const image = () => {
  const img =  new Canvas.Image
  img.src = fs.readFileSync('test/example.png');
  return img
}

const imagePixels = (img, width, yStretch) => {
  return new ImagePixels(img, width, yStretch, new Canvas())
}

describe('isWhiteOrTransparent', () => {
  test('correctly assesses RGB values', () => {
    expect(isWhiteOrTransparent(249, 249, 249, 1)).toBeFalsy()
    expect(isWhiteOrTransparent(250, 250, 250, 1)).toBeFalsy()
    expect(isWhiteOrTransparent(251, 251, 251, 1)).toBeTruthy()
  })
  test('correctly assesses alpha values', () => {
    expect(isWhiteOrTransparent(249, 249, 249, 0.1)).toBeFalsy()
    expect(isWhiteOrTransparent(249, 249, 249, 0.05)).toBeTruthy()    
  })
})

describe('ImagePixels', () => {
  test('Uses image width and height by default', () => {
    const img = image()
    const imgPixels = imagePixels(img)
    expect(imgPixels.width).toBe(img.width)
    expect(imgPixels.height).toBe(img.height)
  })
  test('Allows resizing of the original image', () => {
    const img = image()
    const imgPixels = imagePixels(img, 100)
    expect(imgPixels.width).toBe(100)
    expect(imgPixels.height).not.toBe(img.height)
  })
  test('Allows stretchging of the original image', () => {
    const img = image()
    const imgPixels = imagePixels(img, undefined, 0.5)
    expect(imgPixels.width).toBe(img.width)
    expect(imgPixels.height).toBe(img.height / 2)
  })
})

describe('pixelsToText', () => {
  test('Produces correct output', () => {
    const img = image()
    const imgPixels = imagePixels(img)
    expect(pixelsToText(imgPixels)).toBe(exampleText)
  })
  it('Produces correct output async', () => {
    const img = image()
    const imgPixels = imagePixels(img)
    pixelsToText(imgPixels, { async: true }).then((text) => {
      expect(text).toBe(exampleText)
    })
  })
})

