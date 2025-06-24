const isLocalhost = location.hostname === "localhost";
const isDevEnvironment = location.hostname.includes("dev");
const isTestEnvironment = location.hostname.includes("test");

export const API_BASE_URL = isLocalhost
	? "http://localhost:5000/api"
	: isDevEnvironment
		? "https://attendance-dev-584ef9a99208.herokuapp.com/api"
		: isTestEnvironment
			? ""
			: "";

export const SOCKET_URL = isLocalhost
	? "http://localhost:5000"
	: isDevEnvironment
		? ""
		: isTestEnvironment
			? ""
			: "";

export const FACE_BASE_URL = "https://api.luxand.cloud";
export const FACE_TOKEN = "f491b27fcab246a6a35632e1756b373c";

export const API_ENDPOINTS = {
	BASE: API_BASE_URL,
	BASEURL: `${API_BASE_URL}`,

	AUTH: {
		LOGIN: "/user/login",
		REGISTER: "/user/register",
		LOGOUT: "/user/logout",
	},

	USER: {
		GET_ALL: "/user",
		GET_BY_ID: "/user/:id",
		CREATE: "/user/create",
		UPDATE: "/user/",
		REMOVE: "/user/:id",
		LOGIN: "/user/login",
		LOGOUT: "/user/logout",
		SEARCH: "/user/search",
		UPLOAD: "/user/upload/avatar",
		DASHBOARD: "/user/dashboard",
		SUBSCRIPTION_HISTORY: "/user/subscription/history",
		EXPORT: "/user/export/",
		PRIVACY_SETTINGS: "/user/update/visibility",
		REQUEST_PASSWORD_RESET: "/user/request/reset-password",
	},

	EVENTS: {
		GET_ALL: "/event",
		GET_BY_ID: "/event/get/:id",
		CREATE: "/event",
		UPDATE: "/event/:id",
		REMOVE: "/event/:id",
	},

	SUBJECTS: {
		BASE: "/subjects",
		CREATE: "/subjects",
		GET_BY_ID: "/subjects/:id",
		UPDATE: "/subjects/:id",
		DELETE: "/subjects/:id",
		BY_USER: "/subjects/user/:id",
		BY_INSTRUCTOR: "/subjects/instructor/:id",
		BY_SEMESTER: "/subjects/semester/:id",
	},

	STUDENTS: {
		BASE: "/student",
		CREATE: "/student",
		GET_BY_ID: "/student/:id",
		UPDATE: "/student",
		DELETE: "/student/:id",
		SEARCH: "/student/search",
		UPLOAD_IMAGE: "/student/:id/upload-image",
		EXPORT_CSV: "/student/export/csv",
	},

	ATTENDANCE: {
		ENROLL: "/attendance/enroll",
		PROCESS: "/attendance/process",
		TODAY: "/attendance/today",
		HISTORY: "/attendance/history",
		STUDENT_STATUS: "/attendance/student-status",
		SUBJECT_STATS: "/attendance/subject/:subjectId/stats",
		SUBJECT_STUDENTS_STATUS: "/attendance/subject/:subjectId/students-status",
		TEST_SMS: "/attendance/test-sms",
		OVERALL_STATS: "/attendance/stats",
	},
};
