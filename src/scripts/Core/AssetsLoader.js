class AssetsLoader {
	constructor({ manifest = {}, loader = null, assetsInfos = new Map(), loadedAssets = new Map(), progressCallback = () => null } = {}) {
		this.manifest = manifest;
		this.loader = loader;

		this.assetsToLoad = new Map();
		this.assetsInfos = assetsInfos;

		this.loadedAssets = loadedAssets;
		this.progressCallback = progressCallback;

		this.add(...Object.keys(manifest));
	}

	add(...keys) {
		for (const key of keys) {
			if (!this.assetsToLoad.has(key) && this.manifest[key]) {
				this.assetsToLoad.set(key, this.manifest[key]);
			}
		}
	}

	getAsset(key) {
		return this.loadedAssets.get(key);
	}

	getAssets(...keys) {
		return Object.fromEntries(keys ? [...this.loadedAssets.entries()].filter(([key]) => keys.includes(key)) : this.loadedAssets.entries());
	}

	async loadAsset(key) {
		if (this.loadedAssets.has(key)) return this.loadedAssets.get(key);
		else {
			const asset = await this.loader.loadAsync(this.manifest[key].path, (e) => this.assetProgress(e, key));
			this.loadedAssets.set(key, asset?.scene?.isObject3D && !asset?.userData?.vrm && !asset.animations.length ? asset.scene : asset);
			this.manifest[key].callback?.(this.loadedAssets.get(key));
			return asset;
		}
	}

	loadAssets() {
		return Promise.all([...this.assetsToLoad.keys()].map((key) => this.loadAsset(key)));
	}

	loadCriticalAssets() {
		return Promise.all([...this.assetsToLoad.keys()].map((key) => this.manifest[key].critical && this.loadAsset(key)));
	}

	assetProgress(e, key) {
		if (!this.assetsInfos.has(key)) this.assetsInfos.set(key, { size: e.total, progress: 0 });
		const assetInfos = this.assetsInfos.get(key);
		assetInfos.progress = e.loaded / assetInfos.size;
		this.progressCallback?.();
	}
}

export { AssetsLoader };
