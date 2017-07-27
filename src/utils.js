import Promise from 'bluebird';


class ImagePixels {
	constructor(img) {
		const canvas = document.createElement('canvas')
		canvas.width = img.width
		canvas.height = img.height
		this.height = img.height
		this.width = img.width
		this.context = canvas.getContext('2d')
		this.context.drawImage(img, 0, 0)
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



const isWhite = (r, g, b) => {
	return r > 250 && g > 250 && b > 250 
}

export const pixelsToText = (imgPixels, text, options) => {
	const { reverseText, shouldInsertChar } = Object.assign({}, {
		reverseText: false,
		shouldInsertChar: ({r, g, b, a}) => {
			return !isWhite(r,g,b)
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

export const fileToPixels = (file) => {
	const img = imageFromFile(file)
	img.crossOrigin = "Anonymous"
	return new Promise((resolve, reject) => {
		img.onload = () => {
			resolve(new ImagePixels(img))
		}
		img.onerror = (err) => {
			reject(err)
		}
	})
}

export const imageFromFile = (file) => {
	const img = new Image()
	img.file = file
	document.body.appendChild(img)
	const reader = new FileReader();
  reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
  reader.readAsDataURL(file);
  return img
}

