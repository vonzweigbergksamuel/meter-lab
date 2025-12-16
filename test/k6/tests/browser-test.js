import { check, fail, sleep } from "k6";
import { browser } from "k6/browser";
import exec from "k6/execution";
import http from "k6/http";
import { vars } from "../variables.js";

export async function browserTest() {
	const page = await browser.newPage();

	try {
		// Go to the page first
		await page.goto(vars.URL);

    sleep(5)

		/* ------------- SIGN IN ------------- */
		await page.locator("#email-s1").fill("admin@example.com");
		await page.locator("#password-s1").fill("changeme123");
    await page.locator("#sign-in-btn").click();
		await page.screenshot({ path: "screenshots/signIn.png" });

		/* ------------- CREATE TESTS ------------- */
    sleep(10)
		await page.goto(vars.URL);
    
    await page.locator("#title").fill("Load Testing");
    await page.locator("#description").fill("Load Testing");

		await page.screenshot({ path: "screenshots/testPage.png" });
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
