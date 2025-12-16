import { browserTest } from "./tests/browser-test.js";

/* ------------- MODULES ------------- */
export { options } from "./options.js";
export { setup } from "./setup.js";

// The default exported function is gonna be picked up by k6 as the entry point for the test script. It will be executed repeatedly in "iterations" for the whole duration of the test.
export default async function () {
	await browserTest();
}
