import * as z from "zod";
import { publicProcedure } from "../index.js";

const deviceOutputSChema = z.object({
	devices: z
		.object({
			meter_id: z.string(),
			value: z.coerce.number(),
			unit: z.string(),
		})
		.array(),
});

export const deviceRouter = {
	device: publicProcedure
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() }))
		.output(deviceOutputSChema)
		.handler(() => {
			return { devices: [{ meter_id: "Testing", value: 55, unit: "W" }] };
		}),
};
