export async function mockTestRun(msg: any) {
	const testId = msg.testData?.id;
	if (!testId) {
		console.error("Missing testData.id in message");
		return;
	}

  await simulateTestRun()

	console.log("Test Start URL:", msg.callback.testStart);
	await notifyTestStart(msg.callback.testStart, msg.callback.token, testId);
	console.log("Start");

	await simulateTestRun();
	console.log("Simulated");

	console.log("Test End URL:", msg.callback.testEnd);
	await notifyTestEnd(msg.callback.testEnd, msg.callback.token, testId);
	console.log("End");
}

async function notifyTestStart(url: string, token: string, id: number) {
	try {
		const body = { id };
		console.log("→ Sending testStart:", { url, body, hasToken: !!token });

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"meter-lab-api-key": token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			console.log(`✓ Test start notified (${response.status})`);
		} else {
			const errorText = await response.text();
			console.error(
				`✗ Failed test start (${response.status} ${response.statusText})`,
			);
			console.error("Response:", errorText);
			console.error("Sent body:", body);
		}
	} catch (error) {
		console.error(`✗ Error notifying test start:`, error);
	}
}

async function notifyTestEnd(url: string, token: string, id: number) {
	try {
		const body = { id, status: "completed" };
		console.log("→ Sending testEnd:", { url, body, hasToken: !!token });

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"meter-lab-api-key": token,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (response.ok) {
			console.log(`✓ Test end notified (${response.status})`);
		} else {
			const errorText = await response.text();
			console.error(
				`✗ Failed test end (${response.status} ${response.statusText})`,
			);
			console.error("Response:", errorText);
			console.error("Sent body:", body);
		}
	} catch (error) {
		console.error(`✗ Error notifying test end:`, error);
	}
}

async function simulateTestRun() {
	return new Promise((resolve) => setTimeout(resolve, 10_000));
}
