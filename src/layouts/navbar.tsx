import Avatar from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/providers/theme-provider";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
	onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const { theme, setTheme } = useTheme();
	const { logout, user } = useAuth();
	const navigate = useNavigate();

	const handleSignOut = () => {
		logout();
		navigate("/login");
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<header className="sticky top-0 z-30 border-b border-gray-200  dark:border-gray-700 dark:bg-gray-800">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				<div className="flex items-center">
					<button
						type="button"
						className="mr-4 rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden"
						onClick={onMenuClick}>
						<Menu className="h-6 w-6" />
					</button>
				</div>

				{/* <div className="hidden max-w-md flex-1 md:mx-10 md:block">
					<div className="relative">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<Search className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="search"
							className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-500"
							placeholder="Search users, departments..."
						/>
					</div>
				</div> */}

				<div className="flex items-center space-x-3">
					<button
						className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
						onClick={toggleTheme}>
						{theme === "dark" ? (
							<Sun className="h-5 w-5" />
						) : (
							<Moon className="h-5 w-5" />
						)}
					</button>

					<button className="relative rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
						<Bell className="h-5 w-5" />
						<span className="absolute right-1 top-1.5 h-2 w-2 rounded-full bg-danger-500"></span>
					</button>

					<div className="relative">
						<button
							className="flex items-center rounded-full text-sm focus:outline-none"
							onClick={() => setShowDropdown(!showDropdown)}>
							<Avatar
								src={user?.avatar || "/default-avatar.png"}
								alt={user?.name || "User Avatar"}
								size="small"
							/>
						</button>

						{showDropdown && (
							<div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white border border-gray-200 py-1 shadow-lg  ring-opacity-5 dark:bg-gray-800">
								<Link
									to="/settings"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									onClick={() => setShowDropdown(false)}>
									Settings
								</Link>
								<button
									className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
									onClick={handleSignOut}>
									Sign out
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
