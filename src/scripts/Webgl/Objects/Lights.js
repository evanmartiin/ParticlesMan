import { AmbientLight, Group, PointLight, PointLightHelper } from 'three';
import { app } from '@scripts/App.js';
import { state } from '@scripts/State.js';

export class Lights extends Group {
	constructor() {
		super();
		state.register(this);
		this.lights = this.createLights();
	}

	onAttach() {
		app.debug?.mapping.add(this, 'Lights');
	}

	createLights() {
		const light1 = new PointLight('#ff3939', 1);
		light1.position.set(-7.4, 10, 0);

		const helper1 = new PointLightHelper(light1, 1);

		const light2 = new PointLight('#96EF61', 0.4);
		light2.position.set(7.4, 10, 0);

		const helper2 = new PointLightHelper(light2, 1);

		const light3 = new PointLight('#ffffff', 0.1);
		light3.position.set(0, 1, 3);

		const helper3 = new PointLightHelper(light3, 1);
		helper3.visible = false;

		const light4 = new AmbientLight('#ffffff', 0);

		this.add(light1, light2, light3, light4);

		return { light1, light2, light3, light4, helper1, helper2, helper3 };
	}
}
