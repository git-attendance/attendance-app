export interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "teacher";
	department: string;
	createdAt: Date;
	profileImage?: string;
}

export interface Student {
	id: string;
	studentId: string;
	name: string;
	section: string;
	grade: string;
	guardianName: string;
	guardianEmail: string;
	guardianPhone: string;
	createdAt: Date;
	profileImage?: string;
}

export interface Subject {
	id: string;
	code: string;
	name: string;
	teacherId: string;
	schedule: SubjectSchedule[];
}

export interface SubjectSchedule {
	day: string;
	startTime: string;
	endTime: string;
}

export interface Department {
	id: string;
	name: string;
}

export interface Attendance {
	id: string;
	studentId: string;
	subjectId: string;
	date: Date;
	status: AttendanceStatus;
	checkInTime?: string;
	checkOutTime?: string;
	reason?: AbsenceReason;
	notes?: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "half-day";
export type AbsenceReason =
	| "sick"
	| "family_emergency"
	| "transportation"
	| "weather"
	| "school_activity"
	| "other";

export interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	role: string | null;
}
