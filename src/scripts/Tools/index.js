import { AUDIO } from '@utils/config.js';
import { Audio } from './Audio.js';
import { Keyboard } from './Keyboard.js';
import { Mouse } from './Mouse.js';
import { Viewport } from './Viewport.js';

function createToolsModules() {
	const mouse = new Mouse();
	const viewport = new Viewport();
	const keyboard = new Keyboard();

	if (AUDIO) {
		const audio = new Audio();
		return {
			mouse,
			viewport,
			keyboard,
			audio,
		};
	} else {
		return {
			mouse,
			viewport,
			keyboard,
		};
	}
}

export { createToolsModules };
