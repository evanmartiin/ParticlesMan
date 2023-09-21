import { Cache, FileLoader, TextureLoader } from 'three';

class AjaxTextureLoader extends FileLoader {
	#textureLoader;
	#rgbeLoader;
	constructor(manager) {
		super(manager);

		this.#textureLoader = new TextureLoader();

		this.setResponseType('blob');
	}

	load(url, onLoad, onProgress, onError) {
		const cacheImage = (blob) => {
			const objUrl = URL.createObjectURL(blob);
			const image = document.createElement('img');

			image.onload = () => {
				Cache.add(url, image);
				URL.revokeObjectURL(objUrl);
				document.body.removeChild(image);
				this.#textureLoader.load(url, onLoad, () => {}, onError);
			};

			image.src = objUrl;
			image.style.visibility = 'hidden';
			document.body.appendChild(image);
		};

		super.load(url, cacheImage, onProgress, onError);
	}
}

export { AjaxTextureLoader };
