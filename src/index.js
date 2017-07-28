import { fileToText } from 'Src/utils'

window.onload = () => {
	const handleFileChange = function(e) {
		const file = this.files[0]
		const text = `!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();`
		const width = 200
		const stretch = 0.6
		fileToText(file, text, width, stretch)
		.then((formattedText) => {
			const content = document.getElementById("content");
			content.innerHTML = formattedText
		})
	}	
	const inputElement = document.getElementById("input");
	inputElement.addEventListener("change", handleFileChange, false);
}

