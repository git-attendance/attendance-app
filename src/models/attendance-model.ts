import type { StudentModel } from "./student-model";
import type { SubjectModel } from "./subject-model";

export interface AttendanceModel {
	studentId: StudentModel;
	subjectId: SubjectModel;
	personId: string; // Luxand person ID
	checkInTime: string;
	checkOutTime?: string;
	status: "checked-in" | "checked-out";
	attendanceStatus: "present" | "absent"; // New field for tracking attendance status
	confidence: number; // Face recognition confidence score
	createdAt: Date;
	updatedAt: Date;
}

export interface AttendanceSummaryResponse {
	date: string;
	total: number;
	present: number;
	absent: number;
	records: AttendanceModel[];
}
