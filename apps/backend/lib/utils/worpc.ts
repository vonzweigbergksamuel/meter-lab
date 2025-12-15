import { LoggingHandlerPlugin } from "@orpc/experimental-pino";
import { onError } from "@orpc/server";
import { CORSPlugin } from "@orpc/server/plugins";
import { RPCHandler as WebSocketRPCHandler } from "@orpc/server/ws";
import pino from "pino";
import { websocketRouter } from "../websocket/websocket.js";

const logger = pino();

export const wsRpcHandler = new WebSocketRPCHandler(websocketRouter, {
	plugins: [
		new CORSPlugin(),
		new LoggingHandlerPlugin({
			logger,
			generateId: () => crypto.randomUUID(),
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
