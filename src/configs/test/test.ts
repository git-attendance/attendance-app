export const APP_NAME = "FaceTrack";
export const APP_DESCRIPTION = "School Attendance Management System";

export const AUTH = {
	ROLES: {
		ADMIN: "admin",
		TEACHER: "teacher",
	},
	DEMO_CREDENTIALS: {
		ADMIN: {
			email: "admin@school.com",
			password: "admin123",
		},
		TEACHER: {
			email: "teacher@school.com",
			password: "teacher123",
		},
	},
};

export const ROUTES = {
	AUTH: {
		LOGIN: "/login",
		REGISTER: "/register",
	},
	ADMIN: {
		ROOT: "/admin",
		DASHBOARD: "/admin/dashboard",
		CALENDAR: "/admin/calendar",
		STUDENTS: {
			REGISTER: "/admin/students/register",
			LIST: "/admin/students/list",
		},
		ATTENDANCE: {
			REPORT: "/admin/attendance/report",
		},
		SUBJECTS: "/admin/subjects",
		ACCOUNTS: "/admin/accounts",
		MESSAGES: "/admin/messages",
	},
	TEACHER: {
		ROOT: "/teacher",
		DASHBOARD: "/teacher/dashboard",
		CALENDAR: "/teacher/calendar",
		ATTENDANCE: {
			REPORT: "/teacher/attendance/report",
		},
	},
};

export const API = {
	BASE_URL: "https://api.facetrack.com",
	ENDPOINTS: {
		AUTH: "/auth",
		USERS: "/users",
		STUDENTS: "/students",
		ATTENDANCE: "/attendance",
		SUBJECTS: "/subjects",
	},
};

export const UI = {
	THEME: {
		LIGHT: "light",
		DARK: "dark",
		SYSTEM: "system",
	},
	PAGINATION: {
		DEFAULT_PAGE_SIZE: 10,
		PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
	},
};
