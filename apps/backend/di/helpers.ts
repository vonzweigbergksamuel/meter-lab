import type { KeyValueService } from "../services/sessionStorage/keyValueService.js";
import { container } from "./setup.js";
import { TOKENS } from "./tokens.js";

// 	container.resolve<IAuthService>(TOKENS.AuthService);

export const getKeyValueService = () =>
	container.resolve<KeyValueService>(TOKENS.KeyValueService);
