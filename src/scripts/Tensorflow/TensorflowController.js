import { state } from '@scripts/State.js';
import { TensorflowCamera } from './TensorflowCamera.js';
import { TensorflowCanvas } from './TensorflowCanvas.js';
import { TensorflowPose } from './TensorflowPose.js';

class TensorflowController {
	constructor() {
		state.register(this);

		this.camera = new TensorflowCamera();
		this.pose = new TensorflowPose();
		this.canvas = new TensorflowCanvas();

		this.show();
	}

	show() {
		this.canvas.show();
		this.camera.show();
	}

	hide() {
		this.canvas.hide();
		this.camera.hide();
	}
}

export { TensorflowController };
