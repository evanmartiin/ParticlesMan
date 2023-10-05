import { Scene } from 'three';
import { state } from '@scripts/State.js';
import { Avatar } from './Objects/Avatar.js';
import { Lights } from './Objects/Lights.js';
import { Particles } from './Objects/Particles/Particles.js';
import { Room } from './Objects/Room.js';

class MainScene extends Scene {
	constructor() {
		super();
		state.register(this);

		this.avatar = new Avatar();

		this.particles = new Particles(256);
		this.add(this.particles);

		this.lights = new Lights();
		this.add(this.lights);

		this.room = new Room();
		this.add(this.room);
	}
}

export { MainScene };
