import Promise from 'bluebird';


class ImagePixels {
	constructor(img, width, yStretch) {
		const aspectRatio = (img.height / img.width) * yStretch
		this.width = width || img.width
		this.height = this.width * aspectRatio
		const canvas = document.createElement('canvas')
		canvas.width = this.width
		canvas.height = this.height
		this.context = canvas.getContext('2d')
		this.context.drawImage(img, 0, 0, this.width, this.height)
	}

	get(i, j) {
		const data = this.context.getImageData(i, j, 1, 1).data
		return {
			r: data[0],
			g: data[1],
			b: data[2],
			a: data[3] / 255,
		}
	}
}

const imagePixelsPromise = (img, width, stretch) => {
	return new Promise((resolve, reject) => {
		img.onload = () => {
			resolve(new ImagePixels(img, width, stretch))
		}
		img.onerror = (err) => {
			reject(err)
		}
	})
}

export const isWhiteOrTransparent = (r, g, b, a) => {
	return a < 0.1 || r > 250 && g > 250 && b > 250 
}

export const pixelsToText = (imgPixels, text, options) => {
	const { shouldInsertChar } = Object.assign({}, {
		shouldInsertChar: ({r, g, b, a}) => {
			return !isWhiteOrTransparent(r, g, b, a)
		},
	}, options)

	let chars = []
	let charIndex = 0
	for (let i = 0 ; i < imgPixels.height ; i++) {
		if (i !== 0) {
			chars.push('\n')
		}
		for (let j = 0 ; j < imgPixels.width ; j++) {
			if (shouldInsertChar(imgPixels.get(j, i))) {
				chars.push(text[charIndex % text.length])
			} else {
				chars.push(' ')
			}
			charIndex += 1
		}
	}
	return chars.join('')
}

export const fileToPixels = (file, width, stretch) => {
	const img = imageFromFile(file)
	img.crossOrigin = "Anonymous"
	return imagePixelsPromise(img, width, stretch)
}

export const urlToPixels = (url, width, stretch) => {
	const img = new Image()
	img.crossOrigin = "Anonymous"
	img.src = url
	return imagePixelsPromise(img, width, stretch)
}

export const imageFromFile = (file) => {
	const img = new Image()
	img.file = file
	const reader = new FileReader();
  reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(file);
  return img
}

