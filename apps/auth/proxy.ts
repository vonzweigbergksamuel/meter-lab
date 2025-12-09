import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const getBasePath = () => {
	return process.env.ENVIROMENT === "stage" ? "/auth" : "";
};

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// THIS IS NOT SECURE!
	// This is the recommended approach to optimistically redirect users
	// We recommend handling auth checks in each page/route
	if (!session) {
		const basePath = getBasePath();
		return NextResponse.redirect(new URL(`${basePath}/sign-in`, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sign-in).*)",
	],
};
