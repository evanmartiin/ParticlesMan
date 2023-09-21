import { EVENTS_MAP } from '@utils/constants.js';

class State {
	/** @type State */
	static instance;
	#listeners;
	#onceListeners;
	#cache;
	#instances;
	constructor() {
		/** @type Map<number, Set> */
		this.#listeners = new Map();
		/** @type Map<number, Set> */
		this.#onceListeners = new Map();

		this.#cache = new Map();
		this.#instances = new Set();
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @param {(...any)=> any} fn callback function
	 * @param {{once?: boolean}} params
	 */
	on(id, fn, params = {}) {
		if (!params.once && !this.#listeners.has(id)) this.#listeners.set(id, new Set());
		if (params.once && !this.#onceListeners.has(id)) this.#onceListeners.set(id, new Set());

		(params.once ? this.#onceListeners : this.#listeners).get(id).add(fn);
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @param {(...any)=> any} fn callback function
	 * @returns
	 */
	off(id, fn) {
		if (!this.#listeners.has(id)) return;

		const listeners = this.#listeners.get(id);
		listeners.delete(fn);
	}

	/**
	 *
	 * @param {*} instance the class instance
	 */
	register(instance) {
		this.#instances.add(instance);
	}

	/**
	 *
	 * @param {*} instance the class instance
	 */
	unregister(instance) {
		this.#instances.delete(instance);
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @param  {...any} args event payload
	 */
	emit(id, ...args) {
		this.#cache.set(id, args);
		if (this.#listeners.has(id)) for (const fn of this.#listeners.get(id)) fn.call(this, ...args);

		// Neeeded to emit the event on all the instances
		this.#instances.forEach((instance) => this.#fireMethod(instance, id));

		if (this.#onceListeners.has(id)) {
			for (const fn of this.#onceListeners.get(id)) fn.call(this, ...args);
			this.#onceListeners.delete(id);
		}
	}

	#fireMethod(instance, id) {
		const method = instance[EVENTS_MAP[id]];
		if (typeof method === 'function' && this.#cache.has(id)) method.call(instance, ...this.#cache.get(id));
	}

	static getInstance() {
		if (!State.instance) State.instance = new State();
		return State.instance;
	}
}

const state = State.getInstance();
export { state };
