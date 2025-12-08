import { checkAdminExists } from "@/lib/actions/setup";
import { FirstAdminSetup } from "./first-admin-setup";
import { SignInForm } from "./sign-in-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SignInPage() {
	const hasAdmin = await checkAdminExists();

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			{hasAdmin ? <SignInForm /> : <FirstAdminSetup />}
		</div>
	);
}
