import type { Child, FC } from "hono/jsx";

export const Layout: FC<{ title: string; children?: Child }> = ({
	title,
	children,
}) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>{title}</title>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body class="bg-gray-50">{children}</body>
		</html>
	);
};
