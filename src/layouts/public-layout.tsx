import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
	return (
		<div className="min-h-screen h-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
			<main className="flex-1 overflow-auto p-4 md:p-6">
				<Outlet />
			</main>
		</div>
	);
};
