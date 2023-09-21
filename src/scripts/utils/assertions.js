import { VIDEO_SIZE } from '@scripts/Tensorflow/TensorflowCamera.js';

export function assertIsInCamera(pos) {
	return pos.x > 0 && pos.x < VIDEO_SIZE.width && pos.y > 0 && pos.y < VIDEO_SIZE.height;
}
