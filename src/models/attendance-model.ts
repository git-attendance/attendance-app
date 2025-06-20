export interface AttendanceModel {
	studentId: string;
	subjectId: string;
	personId: string; // Luxand person ID
	checkInTime: Date;
	checkOutTime?: Date;
	status: "checked-in" | "checked-out";
	attendanceStatus: "present" | "absent"; // New field for tracking attendance status
	confidence: number; // Face recognition confidence score
	createdAt: Date;
	updatedAt: Date;
}
