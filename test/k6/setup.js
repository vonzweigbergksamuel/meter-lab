import exec from "k6/execution";
import http from "k6/http";
import { vars } from "./variables.js";

export function setup() {
	const res = http.get(vars.URL);
	if (res.status !== 200) {
		exec.test.abort(
			`Got unexpected status code ${res.status} when trying to setup. Exiting.`,
		);
	}
}
