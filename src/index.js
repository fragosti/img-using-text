import { urlToPixels, fileToPixels, pixelsToText } from 'Src/utils'

window.onload = () => {
	const handleFileChange = function(e) {
		const file = this.files[0]
		fileToPixels(file, 250, .6).then((imgPixels) => {
			const text = pixelsToText(imgPixels, `!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();`);
			const content = document.getElementById("content");
			content.innerHTML = text
		})
	}	
	const inputElement = document.getElementById("input");
	inputElement.addEventListener("change", handleFileChange, false);
}

