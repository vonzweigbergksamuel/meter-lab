export class ParseError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, ParseError.prototype);
	}
}

export class ValidationError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

export class OperationError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, OperationError.prototype);
	}
}

export class NotFoundError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}

export class AuthenticationError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		Object.setPrototypeOf(this, AuthenticationError.prototype);
	}
}
