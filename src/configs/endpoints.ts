const isLocalhost = location.hostname === "localhost";
const isDevEnvironment = location.hostname.includes("dev");
const isTestEnvironment = location.hostname.includes("test");

export const API_BASE_URL = isLocalhost
	? "http://localhost:5000"
	: isDevEnvironment
		? ""
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

export const API_ENDPOINTS = {
	BASE: API_BASE_URL,
	BASEURL: `${API_BASE_URL}/api`,

	AUTH: {
		LOGIN: "/user/login",
		REGISTER: "/user/register",
		LOGOUT: "/user/logout",
	},

	USER: {
		GET_ALL: "/user/get/all",
		GET_BY_ID: "/user/:id",
		CREATE: "/user/create",
		UPDATE: "/user/update",
		REMOVE: "/user/remove/:id",
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
};
