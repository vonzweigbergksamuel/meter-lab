export const options = {
	scenarios: {
		ui: {
			executor: "shared-iterations",
			vus: 1, // num of virtual users
			iterations: 1,
			options: {
				browser: {
					type: "chromium",
					headless: false, // show in broswer - live
				},
			},
		},
	},
};
