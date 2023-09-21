class Store {
	/** @type Store */
	static instance;
	#store;
	#watchers;
	constructor() {
		this.#store = new Map();
		/** @type Map<number, Set> */
		this.#watchers = new Map();
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @returns the value link to this id
	 */
	get(id) {
		return this.#store.get(id);
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @param {any} value the updated value
	 * @returns your value
	 */
	set(id, value) {
		if (value !== this.#store.get(id)) {
			this.#store.set(id, value);
			this.#watchers.get(id)?.forEach((fn) => fn.call(this, value));
		}
		return this.get(id);
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @param {(any) => void} fn callback function called when the value is updated
	 */
	watch(id, fn) {
		if (this.#watchers.has(id)) this.#watchers.get(id).add(fn);
		else this.#watchers.set(id, new Set().add(fn));
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @param {(any) => void} fn callback function which was called when the value was updated
	 * @returns
	 */
	stopWatch(id, fn) {
		if (!this.#watchers.has(id)) return;

		const watchers = this.#watchers.get(id);
		watchers.delete(fn);
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @returns Whether the value is being watch or not
	 */
	watching(id) {
		return this.#watchers.has(id);
	}

	static getInstance() {
		if (!Store.instance) Store.instance = new Store();
		return Store.instance;
	}
}

const store = Store.getInstance();
export { store };
