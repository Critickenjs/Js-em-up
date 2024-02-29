export default function preloadAssets(assets) {
	const promises = assets.map(asset => {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = resolve;
			image.onerror = reject;
			image.src = asset;
		});
	});

	return Promise.all(promises);
}
