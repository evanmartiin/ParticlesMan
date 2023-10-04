import { BackSide, BoxGeometry, Group, Mesh, MeshPhysicalMaterial } from 'three';
import { state } from '@scripts/State.js';

class Room extends Group {
	constructor() {
		super();
		state.register(this);
	}

	onAttach() {
		this.geometry = new BoxGeometry();
		this.material = new MeshPhysicalMaterial({ color: 0x777777, side: BackSide });
		this.mesh = new Mesh(this.geometry, this.material);
		this.mesh.scale.setScalar(10);
		this.mesh.position.y = 1;
		this.add(this.mesh);
		// app.debug?.mapping.add(this, 'Room');
	}
}

export { Room };
