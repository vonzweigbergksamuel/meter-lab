import type { Child, FC } from "hono/jsx";

interface ModalProps {
	id: string;
	children: Child;
}

export const Modal: FC<ModalProps> = ({ id, children }) => {
	return (
		<div
			id={id}
			class="modal hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
		>
			<div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
				{children}
			</div>
		</div>
	);
};

export const ModalTitle: FC<{
	children: Child;
	variant?: "default" | "danger";
}> = ({ children, variant = "default" }) => {
	const colorClass = variant === "danger" ? "text-red-600" : "text-gray-900";
	return <h3 class={`text-lg font-semibold ${colorClass} mb-2`}>{children}</h3>;
};

export const ModalActions: FC<{ children: Child; id?: string }> = ({
	children,
	id,
}) => {
	return (
		<div id={id} class="flex gap-3 justify-end">
			{children}
		</div>
	);
};

export const ModalButton: FC<{
	children: Child;
	type?: "button" | "submit";
	variant?: "primary" | "secondary" | "danger";
	onclick?: string;
}> = ({ children, type = "button", variant = "secondary", onclick }) => {
	const variants = {
		primary: "bg-blue-600 text-white hover:bg-blue-700",
		secondary: "text-gray-700 bg-gray-100 hover:bg-gray-200",
		danger: "bg-red-600 text-white hover:bg-red-700",
	};
	return (
		<button
			type={type}
			onclick={onclick}
			class={`px-4 py-2 rounded-lg transition ${variants[variant]}`}
		>
			{children}
		</button>
	);
};
