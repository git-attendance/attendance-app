import { CalendarTemplate } from "@/components/calendar/calendar-template";
import Dashboard from "@/pages/admin/dashboard";
import AuthPage from "@/pages/auth-page";
import LiveAttendance from "@/pages/live-attendance";
import MarkAttendance from "@/pages/mark-attendance";
import StudentAttendance from "@/pages/students/student-attendance";
import StudentRegister from "@/pages/students/student-register";
import StudentsPage from "@/pages/students/students-page";
import Subjects from "@/pages/subjects-page";

const roleRoutes = [
	{ path: "dashboard", element: <Dashboard /> },
	{ path: "calendar", element: <CalendarTemplate /> },
];

const adminOnlyRoutes = [
	{ path: "mark-attendance", element: <MarkAttendance /> },
	{ path: "live-attendance", element: <LiveAttendance /> },
	{ path: "students/register", element: <StudentRegister /> },
	{ path: "students", element: <StudentsPage /> },
	{ path: "subjects", element: <Subjects /> },
];

export const routesConfig = {
	AUTH: [
		{ path: "/login", element: <AuthPage /> },
		{ path: "/register", element: <AuthPage /> },
	],
	PUBLIC: [{ path: "/attendance", element: <StudentAttendance /> }],
	MAIN: [
		{ path: "/", element: <div>landing</div> },

		// Dynamic routes for roles
		...["admin", "teacher"].flatMap((role) =>
			roleRoutes.map(({ path, element }) => ({
				path: `/${role}/${path}`,
				element,
			})),
		),

		// Admin-only routes
		...adminOnlyRoutes.map(({ path, element }) => ({
			path: `/admin/${path}`,
			element,
		})),
	],
};
