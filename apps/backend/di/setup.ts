import { KeyValueService } from "../services/sessionStorage/keyValueService.js";
import { RedisService } from "../services/sessionStorage/redis/redisService.js";
import { Container } from "./container.js";
import { TOKENS } from "./tokens.js";

export const container = new Container();

// Register services
// container.register<IAuthService>(
// 	TOKENS.AuthService,
// 	() => new BetterAuthService(),
// 	"singleton",
// );

// Register KeyValueService
container.register<KeyValueService>(
	TOKENS.KeyValueService,
	() => new KeyValueService(new RedisService()),
	"singleton",
);
