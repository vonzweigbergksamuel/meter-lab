import * as z from "zod";
import { correctDeviceFormat } from "../../../utils/devices/correctDeviceFormat.js";
import { getRedisService } from "../../redis/redisService.js";
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
			const rs = getRedisService();
			const data = await rs.hGetAll();
			return { devices: correctDeviceFormat(data) };
		}),
};
