/// <reference types="vite/client" />

declare module '*.vert' {
	const content: string;
	export default content;
}
declare module '*.frag' {
	const content: string;
	export default content;
}
declare module '*.fs' {
	const content: string;
	export default content;
}
declare module '*.vs' {
	const content: string;
	export default content;
}
declare module '*.glsl' {
	const content: string;
	export default content;
}

declare module '*.fs?hotShader' {
	const content: HotShader;
	export default content;
}

declare module '*.vs?hotShader' {
	const content: HotShader;
	export default content;
}

declare module '*.json' {
	const value: any;
	export default value;
}

declare module 'virtual-scroll';
declare module 'stats-js';

interface HotShader {
	instances: Set<any, any>;
	use: (material: any) => void;
	unuse: (material: any) => void;
	clear: (material: any) => void;
	update: (material: any) => void;
}

declare const poseDetection: any;
