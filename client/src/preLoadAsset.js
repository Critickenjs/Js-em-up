export default function preloadAssets(soundUrls, imageUrls, callback) {
	let loadedCount = 0;
	let totalCount = soundUrls.length + imageUrls.length;

	function assetLoaded() {
		loadedCount++;
		if (loadedCount === totalCount) {
			callback();
		}
	}

	// Charger les sons
	soundUrls.forEach(function (url) {
		let audio = new Audio();
		audio.onload = assetLoaded;
		audio.src = url;
	});

	// Charger les images
	imageUrls.forEach(function (url) {
		let image = new Image();
		image.onload = assetLoaded;
		image.src = url;
	});
}
