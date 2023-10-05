import { BackSide, BoxGeometry, Group, Mesh, MeshMatcapMaterial } from 'three';
import { state } from '@scripts/State.js';

class Room extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		this.geometry = new BoxGeometry();
		this.material = new MeshMatcapMaterial({ color: 0x111111, side: BackSide });
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.scale.setScalar(10);
		this.mesh.position.y = 1;
		this.add(this.mesh);
	}
}

export { Room };
