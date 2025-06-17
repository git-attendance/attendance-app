import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { APIService } from "./api-service";
import { API_ENDPOINTS } from "@/configs/endpoints";
import { type UserModel } from "@/models/user-model";

export class UserServices extends APIService {
	private asyncFetch;

	constructor() {
		super();
		this.asyncFetch = useAuthFetch();
	}

	async get(userId: string) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.GET_BY_ID.replace(
			":id",
			userId,
		)}${this.query}`;
		this.resetQuery();
		return this.asyncFetch.get(url);
	}

	async getAll() {
		this.resetQuery();
		return this.asyncFetch.get(`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.GET_ALL}`);
	}

	async update(userId: string, userData: UserModel) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.UPDATE.replace(":id", userId)}`;

		return this.asyncFetch.put(url, {
			body: JSON.stringify(userData),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async delete(userId: string) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.REMOVE.replace(":id", userId)}`;
		return this.asyncFetch.delete(url);
	}

	async search(params: any) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.SEARCH}${this.query}`;

		const response = await this.asyncFetch.post(url, {
			body: JSON.stringify(params),
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response;
	}

	uploadAvatar = async (userId: string, files: File | File[]): Promise<any> => {
		try {
			const formData = new FormData();

			if (Array.isArray(files)) {
				files.forEach((file) => formData.append("image", file));
			} else {
				formData.append("image", files);
			}

			const auth = localStorage.getItem("auth");
			const token = auth ? JSON.parse(auth).token : null;

			const response = await fetch(
				`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.USER.UPLOAD.replace(":id", userId)}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
					method: "POST",
					body: formData,
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			return response.json();
		} catch (error) {
			console.error("Error uploading image:", error);
			throw error;
		}
	};
}
