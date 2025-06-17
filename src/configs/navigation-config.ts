import {
	BarChart,
	Calendar,
	ClipboardCheck,
	UserPlus,
	Users,
	FileText,
	BookOpen,
	Mail,
} from "lucide-react";

export const getNavigationItems = (role: "admin" | "teacher") => {
	const isAdmin = role === "admin";

	return [
		{
			name: "Dashboard",
			href: isAdmin ? "/admin/dashboard" : "/teacher/dashboard",
			icon: BarChart,
		},
		{
			name: "Mark Attendance",
			href: isAdmin ? "/admin/mark-attendance" : "/teacher/mark-attendance",
			icon: ClipboardCheck,
		},
		{
			name: "Register Student",
			href: isAdmin ? "/admin/students/register" : "teacher/students/register",
			icon: UserPlus,
		},
		{
			name: "Calendar",
			href: isAdmin ? "/admin/calendar" : "/teacher/calendar",
			icon: Calendar,
		},
		...(isAdmin
			? [
					{ name: "Students", href: "/admin/students/", icon: Users },
					{ name: "Subjects", href: "/admin/subjects", icon: BookOpen },
					{ name: "Accounts", href: "/admin/accounts", icon: Users },
					{ name: "Messages", href: "/admin/messages", icon: Mail },
				]
			: []),
		{
			name: "Reports",
			href: isAdmin ? "/admin/attendance/report" : "/teacher/attendance/report",
			icon: FileText,
		},
	];
};
