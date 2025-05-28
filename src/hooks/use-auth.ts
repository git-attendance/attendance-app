import { useState, useEffect, useCallback } from "react";
import type { User } from "@/models/test";
import { authService } from "@/services/authService";

export const useAuth = () => {
	const [user, setUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Initialize auth state from localStorage
		const currentUser = authService.getCurrentUser();
		console.log("Is Authenticated:", authService.isAuthenticated());
		setUser(currentUser);
		setIsAuthenticated(!!currentUser);
		setIsLoading(false);
	}, []);

	const login = useCallback(async (email: string, password: string): Promise<User | null> => {
		setIsLoading(true);
		const loggedInUser = await authService.login(email, password);
		if (loggedInUser) {
			setUser(loggedInUser);
			setIsAuthenticated(true);
		}
		setIsLoading(false);
		return loggedInUser;
	}, []);

	const logout = useCallback(async () => {
		await authService.logout();
		setUser(null);
		setIsAuthenticated(false);
	}, []);

	return {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
	};
};
