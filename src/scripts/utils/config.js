const debug = import.meta.env.CYPHER_DEBUG === 'true';
const env = import.meta.env.MODE;
const url = new URLSearchParams(window.location.search);

const DEBUG = env === 'development' ? url.has('debug') && debug : debug;

const BREAKPOINTS = {
	tablet: 768,
	desktop: 1025,
	large: 1441,
};

function isiOS() {
	return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid() {
	return /Android/i.test(navigator.userAgent);
}

const ISMOBILE = isAndroid() || isiOS();

export { DEBUG, BREAKPOINTS, ISMOBILE };
