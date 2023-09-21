import { FileLoader, Loader } from 'three';

class AjaxJSONLoader extends Loader {
	#fileLoader;
	constructor(manager) {
		super(manager);

		this.#fileLoader = new FileLoader();
	}

	load(url, onLoad, onProgress, onError) {
		this.#fileLoader.load(
			url,
			/**
			 *
			 * @param {string} text
			 * @returns
			 */
			(text) => {
				try {
					onLoad(JSON.parse(text));
				} catch (error) {
					if (onError !== undefined) onError(error);
					return;
				}
			},
			onProgress,
			onError,
		);
	}
}

export { AjaxJSONLoader };
