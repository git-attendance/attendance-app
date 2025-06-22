import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { APIService } from "./api-service";
import { API_ENDPOINTS } from "@/configs/endpoints";
import type { StudentModel } from "@/models/student-model";

export class StudentService extends APIService {
	private asyncFetch;

	constructor() {
		super();
		this.asyncFetch = useAuthFetch();
	}

	async getAll() {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.BASE}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getById(studentId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.GET_BY_ID.replace(":id", studentId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async create(studentData: Partial<StudentModel>) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.CREATE}`;
		return this.asyncFetch.post(url, {
			body: JSON.stringify(studentData),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async update(studentData: Partial<StudentModel>) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.UPDATE}`;
		return this.asyncFetch.put(url, {
			body: JSON.stringify(studentData),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async delete(studentId: string) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.DELETE.replace(":id", studentId)}`;
		return this.asyncFetch.delete(url);
	}

	async search(query: Partial<StudentModel>) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.SEARCH}`;
		return this.asyncFetch.post(url, {
			body: JSON.stringify(query),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	async uploadImage(studentId: string, file: File) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.UPLOAD_IMAGE.replace(":id", studentId)}`;
		const formData = new FormData();
		formData.append("image", file);

		return this.asyncFetch.post(url, {
			body: formData,
		});
	}

	async exportCSV(): Promise<{ blob: Blob; filename: string }> {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.STUDENTS.EXPORT_CSV}`;
		const response = await this.asyncFetch.get(url);

		const contentDisposition = response.headers.get("Content-Disposition");
		const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
		const filename = filenameMatch?.[1] ?? "students.csv";

		const blob = await response.blob();
		return { blob, filename };
	}
}
