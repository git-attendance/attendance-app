import AdminDashboard from "@/pages/admin/dashboard";
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
			path: "/admin/home",
			element: (
				<>
					<div>landing</div>
				</>
			),
		},

		{
			path: "/admin/dashboard",
			element: <AdminDashboard />,
		},
		{
			path: "/teacher/dashboard",
			element: <AdminDashboard />,
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
