import { APP_CONSTANTS } from "@/configs/app-constants";
import { authService } from "@/services/authService";
import {
	BarChart,
	Calendar,
	ClipboardCheck,
	Cog,
	Home,
	UserPlus,
	Users,
	X,
	FileText,
	BookOpen,
	Mail,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const currentUser = authService.getCurrentUser();
	const isAdmin = currentUser?.role === "admin";

	const navigation = [
		{ name: "Home", href: "/admin/home", icon: Home },
		{
			name: "Dashboard",
			href: isAdmin ? "/admin/dashboard" : "/teacher/dashboard",
			icon: BarChart,
		},
		{ name: "Mark Attendance", href: "/admin/mark-attendance", icon: ClipboardCheck },
		{
			name: "Calendar",
			href: isAdmin ? "/admin/calendar" : "/teacher/calendar",
			icon: Calendar,
		},
		...(isAdmin
			? [
					{ name: "Register Student", href: "/admin/students/register", icon: UserPlus },
					{ name: "Students", href: "/admin/students/list", icon: Users },
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
		{ name: "Settings", href: "/settings", icon: Cog },
	];

	return (
		<>
			{/* Mobile sidebar backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm md:hidden"
					onClick={onClose}></div>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 md:static md:z-auto md:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				<div className="flex h-full flex-col">
					{/* Sidebar header */}
					<div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
						<div className="flex items-center space-x-2">
							<img src={APP_CONSTANTS.APP_LOGO} alt="Logo" className="h-10 w-auto" />
							<h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
								AMS
							</h2>
						</div>
						<button
							className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
							onClick={onClose}>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1 px-2 py-4">
						{navigation.map((item) => (
							<NavLink
								key={item.name}
								to={item.href}
								className={({ isActive }) =>
									`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
										isActive
											? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
											: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									}`
								}
								onClick={() => {
									if (window.innerWidth < 768) {
										onClose();
									}
								}}>
								<item.icon
									className="mr-3 h-5 w-5 flex-shrink-0"
									aria-hidden="true"
								/>
								{item.name}
							</NavLink>
						))}
					</nav>

					{/* User info */}
					<div className="border-t border-gray-200 p-4 dark:border-gray-700">
						<div className="flex items-center">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
								<span className="text-sm font-medium">
									{currentUser?.name
										.split(" ")
										.map((n) => n[0])
										.join("")}
								</span>
							</div>
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
									{currentUser?.name}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{currentUser?.email}
								</p>
							</div>
						</div>
					</div>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
