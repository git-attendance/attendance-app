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
	const isTeacher = role === "teacher";

	return [
		{
			name: "Dashboard",
			href: isAdmin ? "/admin/dashboard" : "/teacher/dashboard",
			icon: BarChart,
		},
		{
			name: "Calendar",
			href: isAdmin ? "/admin/calendar" : "/teacher/calendar",
			icon: Calendar,
		},
		...(isAdmin
			? [
					{
						name: "Register Student",
						href: "/admin/students/register",
						icon: UserPlus,
					},
					{ name: "Students", href: "/admin/students/", icon: Users },
					{ name: "Subjects", href: "/admin/subjects", icon: BookOpen },
					{ name: "Accounts", href: "/admin/accounts", icon: Users },
					{ name: "Messages", href: "/admin/messages", icon: Mail },
				]
			: []),
		...(isTeacher
			? [
					{
						name: "Mark Attendance",
						href: "/teacher/mark-attendance",
						icon: ClipboardCheck,
					},
				]
			: []),
		{
			name: "Reports",
			href: isAdmin ? "/admin/attendance/report" : "/teacher/attendance/report",
			icon: FileText,
		},
	];
};
