export function generateDeviceId() {
	return Math.floor(Math.random() * Date.now());
}