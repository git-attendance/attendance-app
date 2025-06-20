import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { APIService } from "./api-service";
import { API_ENDPOINTS } from "@/configs/endpoints";

export class AttendanceService extends APIService {
	private asyncFetch;

	constructor() {
		super();
		this.asyncFetch = useAuthFetch();
	}

	async getTodayRecords() {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.TODAY}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getStudentHistory(studentId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.BY_STUDENT.replace(":id", studentId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getStudentStatus(studentId: string, subjectId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.BY_STUDENT_AND_SUBJECT.replace(
			":studentId",
			studentId,
		).replace(":subjectId", subjectId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getSubjectRecords(subjectId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.BY_SUBJECT.replace(":id", subjectId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getSubjectStats(subjectId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.STATS.replace(":id", subjectId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async getSubjectStudentsStatus(subjectId: string) {
		this.resetQuery();
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.SUBJECT_STUDENTS_STATUS.replace(":id", subjectId)}${this.query}`;
		return this.asyncFetch.get(url);
	}

	async processAttendance(payload: FormData) {
		const url = `${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.ATTENDANCE.PROCESS}`;
		return this.asyncFetch.post(url, {
			body: payload,
		});
	}
}
