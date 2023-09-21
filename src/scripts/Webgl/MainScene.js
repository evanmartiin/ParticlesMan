import { Scene } from 'three';
import RigCoords from '@utils/RigCoords.js';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { Lights } from './Objects/Lights.js';
import { Particles } from './Objects/Particles/Particles.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();

		this.particles = new Particles(256);
		this.add(this.particles);

		this.lights = new Lights();
		this.add(this.lights);
	}

	onRender() {
		RigCoords.update();
	}
}

export { MainScene };
