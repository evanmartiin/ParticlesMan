import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { state } from '@scripts/State.js';

/** @type Record<any, any> */
const mapping = Object.fromEntries(
	Object.entries(import.meta.glob('./functions/*Debug.js', { import: '*', eager: true })).map(([key, value]) => {
		return [key.split('/').pop().split('.')[0].replace('Debug', ''), value];
	}),
);

class Mapping {
	#childrenToAdd;
	#folders;
	#globalPane;
	#Tweakpane;
	constructor() {
		state.register(this);

		/** @type Map<any, import("tweakpane").FolderApi> */
		this.#childrenToAdd = new Map();
		this.#folders = new Map();
	}
	async load() {
		this.#Tweakpane = await import('tweakpane');
	}

	init() {
		/** @type import('tweakpane').BladeApi */
		this.#globalPane = new this.#Tweakpane.Pane({ title: 'Debug', expanded: true });
		this.#globalPane.registerPlugin(EssentialsPlugin);
	}

	addToParent(instance, name, parentName) {
		if (!this.#childrenToAdd.get(parentName)) this.#childrenToAdd.set(parentName, []);
		this.#childrenToAdd.get(parentName).push(instance);

		if (this.#folders.get(parentName)) mapping[name].createPane(this.#folders.get(parentName), instance, name);
	}

	add(instance, name, customName = '') {
		if (mapping[name]) {
			mapping[name].debug?.(instance);
			const folder = mapping[name].createPane?.(this.#globalPane, instance, customName || name);
			this.#folders.set(name, folder);

			if (this.#childrenToAdd.get(name)) {
				this.#childrenToAdd.get(name).forEach((instance) => mapping[name](folder, instance, name));
				this.#childrenToAdd.delete(name);
			}
		} else console.warn('No debug mapping found for', name);
	}

	onKeyDown(key) {
		if (key === 'h') this.#globalPane.hidden = !this.#globalPane.hidden;
	}
}

export { Mapping };
