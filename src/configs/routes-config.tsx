import { CalendarTemplate } from "@/components/calendar/calendar-template";
import Dashboard from "@/pages/admin/dashboard";
import AuthPage from "@/pages/auth-page";
import LiveAttendance from "@/pages/live-attendance";
import MarkAttendance from "@/pages/mark-attendance";
import StudentRegister from "@/pages/students/student-register";
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
			path: "/admin/live-attendance",
			element: <LiveAttendance />,
		},
		{
			path: "/admin/students/register",
			element: <StudentRegister />,
		},
		{
			path: "/admin/students",
			element: <StudentsPage />,
		},
	],
};
