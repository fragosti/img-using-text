import { fileToPixels, pixelsToText } from 'Src/utils'

window.onload = () => {
	const handleFileChange = function(e) {
		const file = this.files[0]
		fileToPixels(file, 200, 200).then((imgPixels) => {
			const text = pixelsToText(imgPixels, 'Hello world;');
			const content = document.getElementById("content");
			content.innerHTML = text
		})
	}	
	const inputElement = document.getElementById("input");
	inputElement.addEventListener("change", handleFileChange, false);
}

