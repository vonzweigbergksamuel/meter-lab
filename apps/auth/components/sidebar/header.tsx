import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

export function HeaderLogo() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" asChild>
					<Link href="/">
						<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
							<ShieldCheck className="size-4" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold">Auth Admin</span>
							<span className="truncate text-xs">User Management</span>
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
