import { createCoreModules } from '@Core/index.js';
import { WebglController } from '@Webgl/WebglController.js';
import { createToolsModules } from '@Tools/index.js';
import { createDebugModules } from '@Debug/index.js';
import { EVENTS } from '@utils/constants.js';
import { state } from './State.js';
import { TensorflowController } from './Tensorflow/TensorflowController.js';

class App {
	/** @type App */
	static instance;

	async init() {
		this.$app = document.getElementById('app');
		this.$wrapper = document.getElementById('canvas-wrapper');

		this.core = createCoreModules();
		this.tools = createToolsModules();
		this.webgl = new WebglController();
		this.tensorflow = new TensorflowController();

		this.debug = await createDebugModules();
		this.debug?.mapping.init();

		state.emit(EVENTS.ATTACH);
		state.emit(EVENTS.RESIZE, this.tools.viewport.infos);
	}

	static getInstance() {
		if (!App.instance) App.instance = new App();
		return App.instance;
	}
}
const app = App.getInstance();
export { app };
