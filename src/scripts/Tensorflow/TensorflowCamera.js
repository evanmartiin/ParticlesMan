import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

const VIDEO_SIZE = {
	width: 640,
	height: 480,
};

class TensorflowCamera {
	constructor() {
		state.register(this);

		this.videoDOM = document.createElement('video');
		this.videoDOM.width = VIDEO_SIZE.width;
		this.videoDOM.height = VIDEO_SIZE.height;
		this.videoDOM.id = 'tf-video';

		this.asyncInit();
	}

	async asyncInit() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
		}

		const videoConfig = {
			audio: false,
			video: {
				facingMode: 'user',
				width: VIDEO_SIZE.width,
				height: VIDEO_SIZE.height,
				frameRate: {
					ideal: 120,
				},
			},
		};

		const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

		this.videoDOM.srcObject = stream;

		await new Promise((resolve) => {
			this.videoDOM.onloadedmetadata = (video) => {
				resolve(video);
			};
		});

		this.videoDOM.play();

		const videoWidth = this.videoDOM.videoWidth;
		const videoHeight = this.videoDOM.videoHeight;
		this.videoDOM.width = videoWidth;
		this.videoDOM.height = videoHeight;

		this.ready = true;
	}

	onAttach() {
		app.$app.appendChild(this.videoDOM);
	}

	onKeyDown(key) {
		if (key === 'h') {
			this.videoDOM.style.display = this.videoDOM.style.display === 'none' ? 'block' : 'none';
		}
	}

	show() {
		this.videoDOM.classList.remove('hide');
	}

	hide() {
		this.videoDOM.classList.add('hide');
	}
}

export { TensorflowCamera, VIDEO_SIZE };
