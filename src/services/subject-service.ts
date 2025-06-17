import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { APIService } from "./api-service";
import { API_ENDPOINTS } from "@/configs/endpoints";

export class SubjectService extends APIService {
	private asyncFetch;

	constructor() {
		super();
		this.asyncFetch = useAuthFetch();
	}

	async getAll() {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.BASE}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getById(subjectId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.BASE}/${subjectId}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getByUserId(userId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.BY_USER.replace(":id", userId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getByInstructor(instructorId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.BY_INSTRUCTOR.replace(":id", instructorId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getBySemester(semesterId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.BY_SEMESTER.replace(":id", semesterId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async create(subjectData: any) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.CREATE}`;
		return this.asyncFetch.post(url, {
			body: JSON.stringify(subjectData),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async update(subjectId: string, subjectData: any) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.BASE}/${subjectId}`;
		return this.asyncFetch.put(url, {
			body: JSON.stringify(subjectData),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async delete(subjectId: string) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.SUBJECTS.BASE}/${subjectId}`;
		return this.asyncFetch.delete(url);
	}
}
