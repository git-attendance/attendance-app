import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { APIService } from "./api-service";
import { API_ENDPOINTS } from "@/configs/endpoints";
import type { AttendanceSummaryResponse } from "@/models/attendance-model";

export class AttendanceService extends APIService {
	private asyncFetch;

	constructor() {
		super();
		this.asyncFetch = useAuthFetch();
	}

	async getTodayRecords(): Promise<AttendanceSummaryResponse> {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.TODAY}${this.query}`;
		const res = await this.asyncFetch.get(url);
		return res;
	}

	async getAttendanceHistory(
		studentId: string,
		subjectId?: string,
		startDate?: Date,
		endDate?: Date,
	) {
		this.resetQuery();
		let url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.HISTORY}`;

		// Add query parameters
		const params = new URLSearchParams();
		params.append("studentId", studentId);
		if (subjectId) params.append("subjectId", subjectId);
		if (startDate) params.append("startDate", startDate.toISOString());
		if (endDate) params.append("endDate", endDate.toISOString());

		url += `?${params.toString()}`;
		return this.asyncFetch.get(url);
	}

	async getStudentStatus(studentId: string, subjectId: string, startDate?: Date, endDate?: Date) {
		this.resetQuery();
		let url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.STUDENT_STATUS}`;

		// Add query parameters
		const params = new URLSearchParams();
		params.append("studentId", studentId);
		params.append("subjectId", subjectId);
		if (startDate) params.append("startDate", startDate.toISOString());
		if (endDate) params.append("endDate", endDate.toISOString());

		url += `?${params.toString()}`;
		return this.asyncFetch.get(url);
	}

	async getSubjectStats(subjectId: string, startDate?: Date, endDate?: Date) {
		this.resetQuery();
		let url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.SUBJECT_STATS.replace(":subjectId", subjectId)}`;

		// Add query parameters
		const params = new URLSearchParams();
		if (startDate) params.append("startDate", startDate.toISOString());
		if (endDate) params.append("endDate", endDate.toISOString());

		url += `?${params.toString()}`;
		return this.asyncFetch.get(url);
	}

	async getSubjectStudentsStatus(subjectId: string, startDate?: Date, endDate?: Date) {
		this.resetQuery();
		let url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.SUBJECT_STUDENTS_STATUS.replace(":subjectId", subjectId)}`;

		// Add query parameters
		const params = new URLSearchParams();
		if (startDate) params.append("startDate", startDate.toISOString());
		if (endDate) params.append("endDate", endDate.toISOString());

		url += `?${params.toString()}`;
		return this.asyncFetch.get(url);
	}

	async processAttendance(photo: File, subjectId: string) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.PROCESS}`;
		const formData = new FormData();
		formData.append("photo", photo);
		formData.append("subjectId", subjectId);
		return this.asyncFetch.post(url, { body: formData });
	}

	async enrollFace(photo: File, studentId: string) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.ENROLL}`;
		const formData = new FormData();
		formData.append("photo", photo);
		formData.append("studentId", studentId);
		return this.asyncFetch.post(url, { body: formData });
	}

	async testSMS(phoneNumber: string) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.TEST_SMS}`;
		return this.asyncFetch.post(url, {
			body: JSON.stringify({ phoneNumber }),
			headers: { "Content-Type": "application/json" },
		});
	}

	async getOverallStats(filters?: {
		studentId?: string;
		subjectId?: string;
		startDate?: Date;
		endDate?: Date;
	}) {
		this.resetQuery();
		let url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.OVERALL_STATS}`;

		// Add query parameters
		if (filters) {
			const params = new URLSearchParams();
			if (filters.studentId) params.append("studentId", filters.studentId);
			if (filters.subjectId) params.append("subjectId", filters.subjectId);
			if (filters.startDate) params.append("startDate", filters.startDate.toISOString());
			if (filters.endDate) params.append("endDate", filters.endDate.toISOString());

			url += `?${params.toString()}`;
		}

		return this.asyncFetch.get(url);
	}
}
