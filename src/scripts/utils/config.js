const debug = import.meta.env.CYPHER_DEBUG === 'true';
const env = import.meta.env.MODE;
const url = new URLSearchParams(window.location.search);

const INSTALL = import.meta.env.CYPHER_INSTALL === 'true' || url.has('install');

const DEBUG = env === 'development' ? url.has('debug') && debug : debug;

const BREAKPOINTS = {
	tablet: 768,
	desktop: 1025,
	large: 1441,
};

export { DEBUG, BREAKPOINTS, INSTALL };
