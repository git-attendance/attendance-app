import Dashboard from "@/pages/admin/dashboard";
import AuthPage from "@/pages/auth-page";
import MarkAttendance from "@/pages/mark-attendance";

export const routesConfig = {
	AUTH: [
		{
			path: "/login",
			element: <AuthPage />,
		},

		{
			path: "/register",
			element: <AuthPage />,
		},
	],
	MAIN: [
		{
			path: "/",
			element: (
				<>
					<div>landing</div>
				</>
			),
		},

		{
			path: "/admin/dashboard",
			element: <Dashboard />,
		},
		{
			path: "/teacher/dashboard",
			element: <Dashboard />,
		},
		{
			path: "/admin/mark-attendance",
			element: <MarkAttendance />,
		},
		{
			path: "/admin/students/register",
			element: <div>Register Student</div>,
		},
	],
};
