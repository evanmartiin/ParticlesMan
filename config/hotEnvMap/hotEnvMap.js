const hotEnvMap = ({ isDev = false }) => ({
	name: 'vite-plugin-hotEnvMap',
	enforce: 'post',

	handleHotUpdate({ file, server }) {
		if (file.endsWith('.hdr')) {
			server.ws.send({
				type: 'custom',
				event: 'envmap-reload',
				data: file,
			});
			return [];
		}
	},
});

export default hotEnvMap;
