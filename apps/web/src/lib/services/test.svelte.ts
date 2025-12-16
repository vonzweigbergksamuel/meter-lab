import type { AppRouterClient, SocketRouterClient } from "@meter-lab/orpc";
import { getContext, setContext } from "svelte";

const DEFAULT_KEY = "$_test_service";

export type TestData = {
	id: number;
	title: string;
	description: string;
	testType: "alive" | "stress";
	status: "pending" | "running" | "completed" | "failed";
	startAt: Date | null;
	endAt: Date | null;
	devices: string[];
};

interface ITestService {
	tests: TestData[];
	loading: boolean;
	error: Error | null;
	status: "idle" | "connected" | "disconnected";
	all: TestData[];
	hydrate: (tests: TestData[]) => void;
	fetchTests: (rpcClient: AppRouterClient) => Promise<void>;
	startStreaming: (wsClient: SocketRouterClient) => Promise<void>;
}

export class TestService implements ITestService {
	tests = $state<TestData[]>([]);
	loading = $state<boolean>(false);
	error = $state<Error | null>(null);
	status = $state<"idle" | "connected" | "disconnected">("idle");

	all = $derived(this.tests);

	hydrate(tests: TestData[]) {
		this.tests = tests;
		this.loading = false;
		this.error = null;
	}

	async fetchTests(rpcClient: AppRouterClient) {
		try {
			this.loading = true;
			this.error = null;
			const response = await rpcClient.tests.allTests({});
			this.tests = response as TestData[];
		} catch (err) {
			this.error = err instanceof Error ? err : new Error(String(err));
			console.error("Error fetching tests:", this.error);
		} finally {
			this.loading = false;
		}
	}

	async startStreaming(wsClient: SocketRouterClient) {
		if (this.status === "connected") {
			return;
		}

		this.status = "connected";
		this.loading = false;

		try {
			const stream = await wsClient.testUpdates();

			for await (const testUpdate of stream) {
				if (testUpdate && typeof testUpdate === "object" && "id" in testUpdate) {
					this.updateTest(testUpdate as TestData);
				}
			}
		} catch (error) {
			console.error("WebSocket error:", error);
			this.error = error instanceof Error ? error : new Error(String(error));
			this.status = "disconnected";
		}
	}

	private updateTest(updatedTest: TestData) {
		const index = this.tests.findIndex((t) => t.id === updatedTest.id);
		if (index >= 0) {
			this.tests[index] = updatedTest;
		} else {
			this.tests = [updatedTest, ...this.tests];
		}
	}
}

export const getTestService = (key = DEFAULT_KEY) => {
	return getContext<TestService>(key);
};

export const setTestService = (service: TestService, key = DEFAULT_KEY) => {
	return setContext(key, service);
};
