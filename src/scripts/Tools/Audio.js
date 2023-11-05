import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

class Audio {
	constructor() {
		state.register(this);
		this.ready = false;
		this.frequencyData = 0;
		this.FREQUENCY = 100;
		this.FORCE = 1;
	}

	async onFirstClick() {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
		}

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

		if (!stream) return;

		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = audioContext.createAnalyser();
		this.analyser.minDecibels = -100;
		this.analyser.maxDecibels = -10;
		this.analyser.smoothingTimeConstant = 0.5;
		this.analyser.fftSize = 2048;

		const source = audioContext.createMediaStreamSource(stream);
		source.connect(this.analyser);
		this.ready = true;
		app?.debug.mapping.add(this, 'Audio');
	}

	onTick() {
		if (!this.ready) return;
		const dataArray = new Uint8Array(this.analyser.fftSize);
		this.analyser.getByteFrequencyData(dataArray);

		this.frequencyData = (dataArray[Math.floor(this.FREQUENCY / 23.4375)] / 255) * this.FORCE;
	}
}

export { Audio };
