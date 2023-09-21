import { Cache, FileLoader, ImageLoader } from 'three';

class AjaxImageLoader extends FileLoader {
	#imageLoader;
	constructor(manager) {
		super(manager);

		this.#imageLoader = new ImageLoader();

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
				this.#imageLoader.load(url, onLoad, () => {}, onError);
			};

			image.src = objUrl;
			image.style.visibility = 'hidden';
			document.body.appendChild(image);
		};

		super.load(url, cacheImage, onProgress, onError);
	}
}

export { AjaxImageLoader };
