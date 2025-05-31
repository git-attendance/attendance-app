import { CalendarTemplate } from "@/components/calendar/calendar-template";
import Dashboard from "@/pages/admin/dashboard";
import AuthPage from "@/pages/auth-page";
import MarkAttendance from "@/pages/mark-attendance";
import StudentsPage from "@/pages/students/students-page";

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
			path: "/teacher/calendar",
			element: <CalendarTemplate />,
		},
		{
			path: "/admin/calendar",
			element: <CalendarTemplate />,
		},
		{
			path: "/admin/mark-attendance",
			element: <MarkAttendance />,
		},
		{
			path: "/admin/students/register",
			element: <div>Register Student</div>,
		},
		{
			path: "/admin/students",
			element: <StudentsPage />,
		},
	],
};
