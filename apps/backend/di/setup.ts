import { Container } from "./container.js";
import { TOKENS } from "./tokens.js";

export const container = new Container();

// Register services
// container.register<IAuthService>(
// 	TOKENS.AuthService,
// 	() => new BetterAuthService(),
// 	"singleton",
// );
