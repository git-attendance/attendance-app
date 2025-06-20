import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import { useTheme } from "@/providers/theme-provider";

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { theme } = useTheme();

	// Set the theme class on the document
	useEffect(() => {
		if (theme === "dark") {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [theme]);

	return (
		<div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-200 via-white to-indigo-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800">
			{/* Sidebar */}
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			{/* Content area */}
			<div className="flex flex-1 flex-col overflow-hidden">
				<Navbar onMenuClick={() => setSidebarOpen(true)} />

				<main className="flex-1 overflow-auto p-4 md:p-6">
					<div className="mx-auto max-w-7xl">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
