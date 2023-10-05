import { Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import fragmentShader from '@Webgl/Materials/Ground/fragment.fs';
import vertexShader from '@Webgl/Materials/Ground/vertex.vs';
import { state } from '@scripts/State.js';

class Ground extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		this.geometry = new PlaneGeometry();
		this.material = new ShaderMaterial({
			vertexShader,
			fragmentShader,
		});
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.scale.setScalar(20);
		this.mesh.rotateX(-Math.PI * 0.5);
		this.mesh.position.y = -2;
		this.add(this.mesh);
	}
}

export { Ground };
