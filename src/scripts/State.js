import { EVENTS_MAP } from '@utils/constants.js';

class State {
	/** @type State */
	static instance;
	#listeners;
	#cache;
	#instances;
	constructor() {
		/** @type Map<number, Set> */
		this.#listeners = new Map();

		this.#cache = new Map();
		this.#instances = new Set();
	}

	/**
	 *
	 * @param {number} id defined in the constants file
	 * @param {(...any)=> any} fn callback function
	 */
	on(id, fn) {
		if (!this.#listeners.has(id)) this.#listeners.set(id, new Set());

		this.#listeners.get(id).add(fn);
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
	 * @param {number} id defined in the constants file
	 * @param  {...any} args event payload
	 */
	emit(id, ...args) {
		this.#cache.set(id, args);
		if (this.#listeners.has(id)) for (const fn of this.#listeners.get(id)) fn.call(this, ...args);

		// Neeeded to emit the event on all the instances
		this.#instances.forEach((instance) => this.#fireMethod(instance, id));
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
