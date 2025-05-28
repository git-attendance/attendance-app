import type { Attendance, Department, Student, Subject, User } from "@/models/test";

export const mockUsers: User[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john.doe@school.com",
		role: "teacher",
		department: "Mathematics",
		createdAt: new Date("2024-01-15"),
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane.smith@school.com",
		role: "teacher",
		department: "Science",
		createdAt: new Date("2024-01-20"),
	},
	{
		id: "3",
		name: "Admin User",
		email: "admin@school.com",
		role: "admin",
		department: "Administration",
		createdAt: new Date("2024-01-01"),
	},
];

export const mockStudents: Student[] = [
	{
		id: "1",
		studentId: "STU001",
		name: "Alice Johnson",
		section: "A",
		grade: "10",
		guardianName: "Robert Johnson",
		guardianEmail: "robert.j@example.com",
		guardianPhone: "+1234567890",
		createdAt: new Date("2024-01-10"),
	},
	{
		id: "2",
		studentId: "STU002",
		name: "Bob Wilson",
		section: "B",
		grade: "10",
		guardianName: "Mary Wilson",
		guardianEmail: "mary.w@example.com",
		guardianPhone: "+1234567891",
		createdAt: new Date("2024-01-11"),
	},
];

export const mockSubjects: Subject[] = [
	{
		id: "1",
		code: "MATH101",
		name: "Mathematics",
		teacherId: "1",
		schedule: [
			{ day: "Monday", startTime: "08:00", endTime: "09:30" },
			{ day: "Wednesday", startTime: "08:00", endTime: "09:30" },
		],
	},
	{
		id: "2",
		code: "SCI101",
		name: "Science",
		teacherId: "2",
		schedule: [
			{ day: "Tuesday", startTime: "10:00", endTime: "11:30" },
			{ day: "Thursday", startTime: "10:00", endTime: "11:30" },
		],
	},
];

export const mockDepartments: Department[] = [
	{ id: "1", name: "Mathematics" },
	{ id: "2", name: "Science" },
	{ id: "3", name: "English" },
	{ id: "4", name: "History" },
	{ id: "5", name: "Physical Education" },
];

export const mockAttendance: Attendance[] = [
	{
		id: "1",
		studentId: "1",
		subjectId: "1",
		date: new Date("2024-02-01"),
		status: "present",
		checkInTime: "08:00",
		checkOutTime: "09:30",
	},
	{
		id: "2",
		studentId: "2",
		subjectId: "1",
		date: new Date("2024-02-01"),
		status: "absent",
		reason: "sick",
	},
];
