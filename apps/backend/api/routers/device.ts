import * as z from "zod";
import { getDeviceController } from "../../di/helpers.js";
import { protectedProcedure } from "../index.js";

const deviceOutputSChema = z.object({
	devices: z
		.object({
			device_id: z.string(),
			device_status: z.string(),
		})
		.array(),
});

export const deviceRouter = {
	device: protectedProcedure
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() }))
		.output(deviceOutputSChema)
		.handler(async () => {
			return getDeviceController().getDevices();
		}),
};
