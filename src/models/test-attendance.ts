export interface Student {
	id: string;
	fullName: string;
	studentId: string;
	grade: string;
	section: string;
	strand?: string;
	email?: string;
	photoUrl?: string;
	faceDescriptors?: Float32Array[];
	createdAt: Date;
}

export interface AttendanceRecord {
	id: string;
	studentId: string;
	timeIn: Date;
	timeOut: Date | null;
	status: "ENROLLED" | "ABSENT" | "LATE";
	date: string;
}

export interface Subject {
	id: string;
	name: string;
	code: string;
	instructor: string;
	room: string;
	schedule: string;
	color: string;
	createdAt: Date;
}

export interface FaceRecognitionData {
	descriptors: Float32Array[];
	confidence: number;
}

export interface AttendanceDisplay {
	student: Student;
	attendance: AttendanceRecord;
	displayTime: Date;
}
