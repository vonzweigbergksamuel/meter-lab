import { fail, sleep } from "k6";
import { browser } from "k6/browser";
import { vars } from "../variables.js";

export async function browserTest() {
	const page = await browser.newPage();

	try {
		// Go to the page first
		await page.goto(vars.URL);

		sleep(5);

		/* ------------- SIGN IN ------------- */
		await page.locator("#email-s1").fill("admin@example.com");
		await page.locator("#password-s1").fill("changeme123");
		await page.locator("#sign-in-btn").click();
		await page.screenshot({ path: "screenshots/signIn.png" });

		/* ------------- CREATE TESTS ------------- */
		sleep(10);
		await page.goto(vars.URL);

		await page.locator("#title").fill("Load Testing");
		await page.locator("#description").fill("Load Testing");

		// Click the first select dropdown trigger
		await page.locator("[data-select-trigger]").nth(0).click();

		// Wait for the dropdown options to appear
		await page.waitForSelector('[role="option"]');

		// Click the first option in the list
		await page.locator('[role="option"]').first().click();

		// Click the "Select devices" dropdown using ID
		await page.locator("#bits-c1").click();

		// Wait for and select the first option
		await page.waitForSelector('[role="option"]');
		await page.locator('[role="option"]').first().click();

		// Close the dropdown (if it didn’t auto-close)
		await page.keyboard.press("Escape");

		// Wait for the "Create Test" button to be visible and clickable
		await page.waitForSelector("#create-test-btn");

		// Click the button
		await page.locator("#create-test-btn").click();

		await page.screenshot({ path: "screenshots/testPage.png" });

		sleep(10);
    await page.goto("http://localhost:5080/tests")
    sleep(10);
		await page.screenshot({ path: "screenshots/newPage.png" });
	} catch (error) {
		console.error("Full error caught: ", error);
		fail(
			`Browser iteration failed: ${error?.message || error || "Unknown error"}`,
		);
	} finally {
		await page.close();
	}

	sleep(1);
}
