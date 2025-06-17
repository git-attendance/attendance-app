import type { UserModel } from "@/models/user-model";
import { AuthService } from "@/services/auth-service";
import { UserServices } from "@/services/user-service";
import { isTokenExpired } from "@/utils/token-check";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
	user: UserModel | any;
	token: string | null;
	userInfo: UserModel | null;
	setUserInfo: React.Dispatch<React.SetStateAction<UserModel | null>>;
	login: (credentials: { email: string; password: string; role: string }) => Promise<void>;
	register: (userData: any) => Promise<void>;
	logout: () => void;
	updateUser: (userId: string, userData: any) => Promise<void>;
	searchUsers: (params: any) => Promise<UserModel[] | []>;
	isAuthenticated: boolean;
	isLoading: boolean;
	fetchUserDetails: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<any>(null);
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")!).token : null,
	);
	const [userInfo, setUserInfo] = useState<UserModel | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const userService = new UserServices();
	const authService = new AuthService();

	useEffect(() => {
		const storedAuth = localStorage.getItem("auth");
		if (storedAuth) {
			const parsedAuth = JSON.parse(storedAuth);
			const isExpired = isTokenExpired(parsedAuth.token);
			setToken(parsedAuth.token);
			setUser(parsedAuth.user);
			if (isExpired) {
				console.warn("Token expired. Logging out.");
				logout();
				return;
			}

			if (!parsedAuth.user) {
				authService
					.getCurrentUser()
					.then((data) => {
						setUser(data?.user);
						setIsAuthenticated(true);
						setIsLoading(false);

						localStorage.setItem(
							"auth",
							JSON.stringify({ token: parsedAuth.token, user: data?.user }),
						);

						fetchUserDetails(data?.user?._id);
					})
					.catch(() => logout());
			} else {
				setIsAuthenticated(true);
				setIsLoading(false);
				fetchUserDetails(parsedAuth.user._id);
			}
		} else {
			setIsAuthenticated(false);
			setIsLoading(false);
		}
	}, [token]);

	const fetchUserDetails = (userId: string) => {
		if (userId) {
			userService.get(userId).then((userData) => {
				setUserInfo(userData);
			});
		}
	};

	const login = async (credentials: any) => {
		const data = await authService.login(credentials);

		if (data?.token) {
			localStorage.setItem("auth", JSON.stringify({ token: data.token, user: data.user }));
			setToken(data.token);
			setUser(data.user);
			setIsAuthenticated(true);

			fetchUserDetails(data.user._id);
		}
	};

	const register = async (userData: any) => {
		await authService.register(userData);
	};

	const logout = () => {
		authService.logout();
		localStorage.removeItem("auth");
		setToken(null);
		setUser(null);
		setUserInfo(null);

		setIsAuthenticated(false);

		localStorage.removeItem("lastVisitedPath");
	};

	const updateUser = async (userId: string, userData: any) => {
		try {
			const updatedUser = await userService.update(userId, userData);
			return updatedUser;
		} catch (error) {
			console.error("Failed to update user:", error);
			throw error;
		}
	};

	const searchUsers = async (params: any) => {
		try {
			return await userService.search(params);
		} catch (error) {
			console.error("Failed to search users:", error);
			return null;
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				userInfo,
				setUserInfo,
				login,
				register,
				logout,
				updateUser,
				searchUsers,
				isLoading,
				isAuthenticated,
				fetchUserDetails,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export { AuthProvider, useAuth };
