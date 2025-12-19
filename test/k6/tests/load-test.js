import { check, sleep } from "k6";
import http from "k6/http";
import { Rate } from "k6/metrics";
import { vars } from "../variables.js";

export const options = {
	scenarios: {
		load_test: {
			executor: "shared-iterations",
			vus: 20,
			iterations: 1000,
			maxDuration: "10m",
		},
	},
	thresholds: {
		http_req_duration: ["p(95)<2000"],
		http_req_failed: ["rate<0.1"],
		errors: ["rate<0.1"],
	},
};

const errorRate = new Rate("errors");

const DEVICES_PER_TEST = 5;

function getRandomDevices(devices, count) {
	const availableDevices = devices.filter(
		(device) => device.device_status === "available",
	);
	const shuffled = [...availableDevices].sort(() => Math.random() - 0.5);
	return shuffled
		.slice(0, Math.min(count, shuffled.length))
		.map((device) => device.device_id);
}

function getAuthToken() {
	const authUrl = vars.AUTH_URL || "https://auth.nordicode.se/api/auth";
	const email = vars.EMAIL || "admin@example.com";
	const password = vars.PASSWORD || "changeme123";

	const signInResponse = http.post(
		`${authUrl}/sign-in/email`,
		JSON.stringify({
			email,
			password,
			callbackURL: "https://nordicode.se",
			rememberMe: true,
		}),
		{
			headers: { "Content-Type": "application/json" },
		},
	);

	if (signInResponse.status !== 200) {
		console.error(
			`Sign-in failed with status ${signInResponse.status}: ${signInResponse.body}`,
		);
		return null;
	}

	const cookies = {};
	if (signInResponse.cookies) {
		Object.keys(signInResponse.cookies).forEach((key) => {
			const cookieArray = signInResponse.cookies[key];
			if (cookieArray && cookieArray.length > 0) {
				cookies[key] = cookieArray[0].value;
			}
		});
	}

	const cookieHeader = Object.keys(cookies)
		.map((key) => `${key}=${cookies[key]}`)
		.join("; ");

	if (!cookieHeader) {
		console.error("No cookies received from sign-in");
		try {
			const body = JSON.parse(signInResponse.body);
			if (body.token) {
				return body.token;
			}
		} catch {
			console.error("Failed to parse sign-in response:", signInResponse.body);
		}
		return null;
	}

	const tokenResponse = http.get(`${authUrl}/token`, {
		headers: {
			Cookie: cookieHeader,
			Accept: "application/json",
		},
	});

	if (tokenResponse.status === 200) {
		try {
			const body = JSON.parse(tokenResponse.body);
			if (body.token) {
				return body.token;
			}
			console.error("Token not found in response:", tokenResponse.body);
		} catch {
			console.error("Failed to parse token response:", tokenResponse.body);
		}
	} else {
		console.error(
			`Token endpoint failed with status ${tokenResponse.status}: ${tokenResponse.body}`,
		);
	}

	return null;
}

export function setup() {
	const token = getAuthToken();
	if (!token) {
		throw new Error("Failed to get auth token");
	}

	const backendUrl = vars.BACKEND_URL || "https://api.nordicode.se/api";

	const devicesResponse = http.get(`${backendUrl}/device`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		},
	});

	if (devicesResponse.status !== 200) {
		throw new Error(
			`Failed to fetch devices from API: ${devicesResponse.status} - ${devicesResponse.body}`,
		);
	}

	const devicesData = JSON.parse(devicesResponse.body);
	const devices = devicesData.devices || [];

	if (devices.length === 0) {
		throw new Error("No devices found in the system");
	}

	const availableCount = devices.filter(
		(d) => d.device_status === "available",
	).length;

	console.log(
		`Found ${devices.length} total devices, ${availableCount} available`,
	);

	return {
		token,
		devices,
		backendUrl,
	};
}

export default function (data) {
	const { token, backendUrl } = data;
	const testTypes = ["alive", "stress"];

	const devicesResponse = http.get(`${backendUrl}/device`, {
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: "application/json",
		},
		tags: { name: "getDevices" },
	});

	if (devicesResponse.status !== 200) {
		console.error(
			`Failed to fetch devices: ${devicesResponse.status} - ${devicesResponse.body}`,
		);
		return;
	}

	let devices = [];
	try {
		const devicesData = JSON.parse(devicesResponse.body);
		devices = devicesData.devices || [];
	} catch {
		console.error("Failed to parse devices response");
		return;
	}

	const randomDevices = getRandomDevices(devices, DEVICES_PER_TEST);

	if (randomDevices.length < DEVICES_PER_TEST) {
		console.warn(
			`Not enough available devices: found ${randomDevices.length}, needed ${DEVICES_PER_TEST}`,
		);
		return;
	}

	const testType = testTypes[Math.floor(Math.random() * testTypes.length)];

	const testPayload = {
		title: `Load Test ${Math.floor(Math.random() * 10000)}`,
		description: `Load test description for ${randomDevices.length} devices`,
		testType,
		devices: randomDevices,
	};

	const createResponse = http.post(
		`${backendUrl}/tests/createTests`,
		JSON.stringify(testPayload),
		{
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			tags: { name: "createTest" },
		},
	);

	const createSuccess = check(createResponse, {
		"create test status is 200": (r) => r.status === 200,
		"create test has testId": (r) => {
			try {
				const body = JSON.parse(r.body);
				return body.testId !== undefined;
			} catch {
				return false;
			}
		},
	});

	if (createResponse.status === 400 || createResponse.status === 422) {
		try {
			const body = JSON.parse(createResponse.body);
			if (
				body.message &&
				(body.message.includes("unavailable") ||
					body.message.includes("not available"))
			) {
				console.warn(`Device unavailable, skipping iteration: ${body.message}`);
				return;
			}
		} catch {
			// Ignore parse errors
		}
	}

	errorRate.add(!createSuccess);

	if (createSuccess) {
		try {
			const body = JSON.parse(createResponse.body);
			const testId = body.testId;

			const findResponse = http.get(
				`${backendUrl}/tests/findTests?id=${testId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
					tags: { name: "findTest" },
				},
			);

			check(findResponse, {
				"find test status is 200": (r) => r.status === 200,
			});
		} catch (e) {
			console.error("Failed to parse create test response:", e);
		}
	}

	if (createSuccess) {
		const allTestsResponse = http.get(`${backendUrl}/tests/allTests`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
			tags: { name: "getAllTests" },
		});

		check(allTestsResponse, {
			"get all tests status is 200": (r) => r.status === 200,
			"get all tests returns array": (r) => {
				try {
					const body = JSON.parse(r.body);
					return Array.isArray(body);
				} catch {
					return false;
				}
			},
		});
	}

	sleep(1);
}

export function handleSummary(data) {
	return {
		stdout: JSON.stringify(data, null, 2),
	};
}
