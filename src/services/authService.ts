import type { User } from "@/models/test";
import { mockUsers } from "@/configs/test/mocked-data";
import { AUTH } from "@/configs/test/test";

export const authService = {
	login: async (email: string, password: string): Promise<User | null> => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Check admin credentials
		if (
			email === AUTH.DEMO_CREDENTIALS.ADMIN.email &&
			password === AUTH.DEMO_CREDENTIALS.ADMIN.password
		) {
			const adminUser = mockUsers.find((user) => user.role === "admin");
			if (adminUser) {
				localStorage.setItem("user", JSON.stringify(adminUser));
				return adminUser;
			}
		}

		// Check teacher credentials
		if (
			email === AUTH.DEMO_CREDENTIALS.TEACHER.email &&
			password === AUTH.DEMO_CREDENTIALS.TEACHER.password
		) {
			const teacherUser = mockUsers.find((user) => user.role === "teacher");
			if (teacherUser) {
				localStorage.setItem("user", JSON.stringify(teacherUser));
				return teacherUser;
			}
		}

		return null;
	},

	logout: async (): Promise<void> => {
		localStorage.removeItem("user");
	},

	getCurrentUser: (): User | null => {
		const userStr = localStorage.getItem("user");
		return userStr ? JSON.parse(userStr) : null;
	},

	setCurrentUser: (user: User): void => {
		localStorage.setItem("user", JSON.stringify(user));
	},

	isAuthenticated: (): boolean => {
		return !!localStorage.getItem("user");
	},
};
