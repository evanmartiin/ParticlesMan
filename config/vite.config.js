//@ts-nocheck
import fs from 'fs';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import hotEnvMap from './hotEnvMap/hotEnvMap.js';
import hotShaders from './hotShaders/hotShadersRollupPlugin.js';
import ifdef from './ifdef/ifdefRollupPlugin.js';

export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	process.stdout.write('\n\x1b[2mv' + process.env.npm_package_version + '\x1b[22m\n');
	process.stdout.write('\n🏁 Project : ' + process.env.npm_package_name);
	process.stdout.write('\n🪲  Environnement : ' + mode);
	process.stdout.write('\n🚧 DEBUG is : ' + env.CYPHER_DEBUG + '\n\n');

	return defineConfig({
		server: {
			port: 8080,
			https: false,
			open: false,
			host: true,
			watch: {
				usePolling: true,
			},
		},
		plugins: [hotShaders({ isDev: env.CYPHER_DEBUG === 'true', compress: true }), hotEnvMap({ isDev: env.CYPHER_DEBUG === 'true' }), ifdef({ DEBUG: env.CYPHER_DEBUG === 'true' })],
		resolve: {
			alias: getAliasesFromJsConfig(),
		},
		appType: 'spa',
		envPrefix: 'CYPHER_',
		base: env.CYPHER_BASE_URL,
	});
};

function getAliasesFromJsConfig() {
	const alias = Object.entries(JSON.parse(fs.readFileSync(resolve(__dirname, '../jsconfig.json')).toString()).compilerOptions.paths).map(([key, value]) => {
		return { find: key.replace('/*', ''), replacement: value[0].replace('./', '/').replace('/*', '') };
	});

	process.stdout.write('📂 ' + alias.length + ' alias loaded\n\n');

	return alias;
}
