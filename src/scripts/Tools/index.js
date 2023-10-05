import { Keyboard } from './Keyboard.js';
import { Mouse } from './Mouse.js';
import { Viewport } from './Viewport.js';

function createToolsModules() {
	const mouse = new Mouse();
	const viewport = new Viewport();
	const keyboard = new Keyboard();

	return {
		mouse,
		viewport,
		keyboard,
	};
}

export { createToolsModules };
