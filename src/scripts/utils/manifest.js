/* 
This file is used to list and load the assets you need. To configure the behavior of the loader you can edit the AssetsManager file.

You can set a priority to your asset to reorder the loading process.

You can add a callback to any of the manifest items anywhere in your code (obviously before the asset is loaded). 
This is usefull if you desactivate the blocking behavior of the loader.

Finally, you can set some item to be criticals if you want your to wait the loading of some assets before initializing the app.
*/

const manifest = {
	images: {},
	textures: {
		pixelSorting: { path: `${import.meta.env.BASE_URL}assets/textures/pixelSorting.jpg`, priority: 2, callback: null },
		glitch: { path: `${import.meta.env.BASE_URL}assets/textures/glitch.jpg`, priority: 2, callback: null },
		// ...
	},
	envMaps: {
		// ...
	},
	models: {
		// ...
	},
	jsons: {},
};

export { manifest };
