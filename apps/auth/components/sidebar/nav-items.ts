import { type LucideIcon, Users } from "lucide-react";

export interface NavItem {
	name: string;
	url: string;
	icon: LucideIcon;
}

export const navItems: { [key: string]: NavItem[] } = {
	navUsers: [
		{
			name: "Users",
			url: "/",
			icon: Users,
		},
	],
};
