import * as z from "zod";
import { getKeyValueStoreService } from "../../di/helpers.js";
import { correctDeviceFormat } from "../../utils/devices/correctDeviceFormat.js";
import { publicProcedure } from "../index.js";

const deviceOutputSChema = z.object({
	devices: z
		.object({
			meter_id: z.string(),
			device_status: z.string(),
		})
		.array(),
});

export const deviceRouter = {
	device: publicProcedure
		.route({ method: "GET" })
		.input(z.object({ limit: z.number().optional() }))
		.output(deviceOutputSChema)
		.handler(async () => {
			const service = getKeyValueStoreService();
			const data = await service.getAll();
			return { devices: correctDeviceFormat(data) };
		}),
};
