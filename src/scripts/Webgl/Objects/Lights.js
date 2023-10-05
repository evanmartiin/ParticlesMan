import { Group, PointLight } from 'three';
import lights from '@utils/lights.json';
// import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export class Lights extends Group {
	constructor() {
		super();
		state.register(this);
		this.lights = this.createLights();
		this.lightConfigs = lights.configs;
		this.currentConfig = 0;

		this.setLightConfig(0);
	}

	onAttach() {
		// app.debug?.mapping.add(this, 'Lights');
	}

	createLights() {
		const light1 = new PointLight();
		const light2 = new PointLight();
		const light3 = new PointLight();
		this.add(light1, light2, light3);
		return { light1, light2, light3 };
	}

	setLightConfig(config) {
		const newConfig = this.lightConfigs[config];
		['light1', 'light2', 'light3'].forEach((lightName) => {
			const light = this.lights[lightName];
			const { r, g, b } = newConfig[lightName].color;
			light.color.setRGB(r, g, b);
			light.intensity = newConfig[lightName].intensity;
			const { x, y, z } = newConfig[lightName].position;
			light.position.set(x, y, z);
		});
		this.currentConfig = config;
	}

	onPointerDown() {
		let randomConfig;
		do {
			randomConfig = Math.floor(Math.random() * this.lightConfigs.length);
		} while (randomConfig === this.currentConfig);
		this.setLightConfig(randomConfig);
	}
}
