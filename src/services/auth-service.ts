import { API_ENDPOINTS } from "@/configs/endpoints";
import { APIService } from "./api-service";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import type { UserModel } from "@/models/test-user-model";

export class AuthService extends APIService {
	private asyncFetch;

	constructor() {
		super();
		this.asyncFetch = useAuthFetch();
	}

	async login(credentials: any) {
		const data: any = await this.asyncFetch.post(
			`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.LOGIN}`,
			{
				body: JSON.stringify(credentials),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (data?.token) {
			localStorage.setItem("auth", JSON.stringify({ token: data.token }));
			this.setCurrentUser(data.user, data.token);
		}
		return data;
	}

	async register(userData: any): Promise<UserModel> {
		const res = await this.asyncFetch.post(
			`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.AUTH.REGISTER}`,
			{
				body: JSON.stringify(userData),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return res.user;
	}

	async logout(): Promise<void> {
		localStorage.removeItem("auth");
		await this.asyncFetch.post(`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.AUTH.LOGOUT}`);
	}

	async getCurrentUser() {
		const auth = localStorage.getItem("auth");
		if (!auth) return null;

		const { userId } = JSON.parse(auth);
		if (!userId) return null;

		const user = await this.asyncFetch.get(
			`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.GET_BY_ID.replace(":id", userId)}`,
		);
		return user;
	}

	private setCurrentUser(user: UserModel, token: string): void {
		localStorage.setItem("auth", JSON.stringify({ token, userId: user._id }));
	}

	isAuthenticated(): boolean {
		return !!localStorage.getItem("auth");
	}
}
