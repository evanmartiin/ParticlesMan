import { Vector3 } from 'three';
import { EVENTS } from '@utils/constants.js';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const DISTANCE_THRESHOLD = 0.035;
const DETECTION_THRESHOLD = 0.4;
const UNDETECTION_THRESHOLD = 0.3;
const UNDETECTION_DURATION = 2;

class TensorflowPose {
	constructor() {
		state.register(this);
		this.asyncInit();
		this.undetectedDuration = 0;
	}

	enable() {
		if (!this.detector) return;
		this.ready = true;
	}

	disable() {
		this.ready = false;
		this.playerDetected = undefined;
		this.undetectedDuration = 0;
	}

	async asyncInit() {
		this.detector = await poseDetection
			.createDetector(poseDetection.SupportedModels.BlazePose, {
				runtime: 'mediapipe',
				modelType: 'lite',
				enableSmoothing: true,
				solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
			})
			.catch((err) => console.error(err));
		this.enable();

		this.loaded = true;
	}

	async onRender({ dt }) {
		if (!this.loaded) return;
		const results = await this.renderResults();

		if (results) {
			const confidenceScores = results.map((result) => result.keypoints.map((keypoint) => keypoint.score).reduce((a, b) => a + b, 0) / result.keypoints.length);
			const highestConfidenceScore = Math.max(...confidenceScores);
			const mostReliableRig = results[confidenceScores.indexOf(highestConfidenceScore)];

			if (mostReliableRig) {
				app.tensorflow.canvas.drawResults(mostReliableRig);
			}

			if ((mostReliableRig && highestConfidenceScore >= DETECTION_THRESHOLD) || (mostReliableRig && highestConfidenceScore >= UNDETECTION_THRESHOLD && this.playerDetected)) {
				if (!this.playerDetected) {
					this.playerDetected = mostReliableRig;
					this.undetectedDuration = 0;
					state.emit(EVENTS.PLAYER_ENTERED);
				} else {
					this.playerDetected = mostReliableRig;
					state.emit(EVENTS.PLAYER_MOVED, mostReliableRig);
				}
			} else {
				if (this.playerDetected) {
					this.playerDetected = undefined;
				}
			}
		}

		if (!this.playerDetected && this.ready) {
			this.undetectedDuration += dt;

			if (this.undetectedDuration > UNDETECTION_DURATION) {
				this.undetectedDuration = 0;
				state.emit(EVENTS.PLAYER_LEFT);
			}
		}
	}

	async renderResults() {
		if (this.ready !== true || app.tensorflow.camera.ready !== true) return;

		if (app.tensorflow.camera.videoDOM.readyState < 2) {
			await new Promise((resolve) => {
				app.tensorflow.camera.videoDOM.onloadeddata = (video) => {
					resolve(video);
				};
			});
		}

		let poses = null;

		try {
			poses = await this.detector.estimatePoses(app.tensorflow.camera.videoDOM, { maxPoses: 1, flipHorizontal: false });
		} catch (error) {
			this.detector.dispose();
			this.detector = null;
			alert(error);
		}

		return poses;
	}
}

export { TensorflowPose };
