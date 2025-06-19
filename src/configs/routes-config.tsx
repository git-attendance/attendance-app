import { CalendarTemplate } from "@/components/calendar/calendar-template";
import AccountsPage from "@/pages/accounts-page";
import Dashboard from "@/pages/admin/dashboard";
import AttendanceList from "@/pages/attendance-reports-list";
import AttendanceReports from "@/pages/attendance-reports-page";
import AuthPage from "@/pages/auth-page";
import LiveAttendance from "@/pages/live-attendance";
import MarkAttendance from "@/pages/mark-attendance";
import MessagesPage from "@/pages/messages-page";
import StudentAttendance from "@/pages/students/student-attendance";
import StudentRegister from "@/pages/students/student-register";
import StudentsPage from "@/pages/students/students-page";
import Subjects from "@/pages/subjects-page";

const roleRoutes = [
	{ path: "dashboard", element: <Dashboard /> },
	{ path: "calendar", element: <CalendarTemplate /> },
];

const adminOnlyRoutes = [
	{ path: "live-attendance", element: <LiveAttendance /> },
	{ path: "students", element: <StudentsPage /> },
	{ path: "students/register", element: <StudentRegister /> },
	{ path: "subjects", element: <Subjects /> },
	{ path: "accounts", element: <AccountsPage /> },
	{ path: "messages", element: <MessagesPage /> },
	{ path: "attendance/report", element: <AttendanceReports /> },
];

const teacherOnlyRoutes = [
	{ path: "attendance/report", element: <AttendanceList /> },
	{ path: "mark-attendance", element: <MarkAttendance /> },
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

		// Teacher-only routes
		...teacherOnlyRoutes.map(({ path, element }) => ({
			path: `/teacher/${path}`,
			element,
		})),
	],
};
