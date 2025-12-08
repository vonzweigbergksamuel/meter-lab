"use client";

import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import type { User } from "@/lib/types";
import { HeaderLogo } from "./header";
import { NavBase } from "./nav-base";
import { navItems } from "./nav-items";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<HeaderLogo />
			</SidebarHeader>
			<SidebarContent>
				<NavBase title="User Management" items={navItems.navUsers} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
