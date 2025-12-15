import { env } from "../../env.js";

type Message = {
	testData: {
		id: number;
		title: string;
		description: string;
		testType: string;
		startAt: string;
		endAt: string;
		status: "pending" | "running" | "completed" | "failed";
		devices: string[];
	};
	callback: {
		testStart: string;
		testEnd: string;
	};
};

export async function mockTestRun(msg: Message) {
	const testId = msg.testData?.id;
	if (!testId) {
		console.error("Missing testData.id in message");
		return;
	}

	await notifyTestStart(msg.callback.testStart, testId);

	await simulateTestRun();
	console.log("Test run simulated");

	await notifyTestEnd(msg.callback.testEnd, testId);
}

async function notifyTestStart(url: string, id: number) {
	try {
		const body = { id };
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Basic ${btoa(`${env.TEST_RUNNER_USERNAME}:${env.TEST_RUNNER_PASSWORD}`)}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			console.log(`✓ Test start notified (${response.status})`);
		}
	} catch (error) {
		console.error(`✗ Error notifying test start:`, error);
	}
}

async function notifyTestEnd(url: string, id: number) {
	try {
		const body = { id, status: "completed" };

		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Basic ${btoa(`${env.TEST_RUNNER_USERNAME}:${env.TEST_RUNNER_PASSWORD}`)}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			console.log(`✓ Test end notified (${response.status})`);
		}
	} catch (error) {
		console.error(`✗ Error notifying test end:`, error);
	}
}

async function simulateTestRun() {
	return new Promise((resolve) => setTimeout(resolve, 10_000));
}
