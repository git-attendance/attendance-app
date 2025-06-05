import type { AttendanceRecord, Student, Subject } from "@/models/test-attendance";
import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import { toast } from "sonner";

interface AttendanceState {
	students: Student[];
	subjects?: Subject[];
	attendanceRecords: AttendanceRecord[];
	isLiveMode: boolean;
}

type AttendanceAction =
	| { type: "SET_STUDENTS"; payload: Student[] }
	| { type: "ADD_STUDENT"; payload: Student }
	| { type: "UPDATE_STUDENT"; payload: Student }
	| { type: "DELETE_STUDENT"; payload: string }
	| { type: "SET_SUBJECTS"; payload: Subject[] }
	| { type: "ADD_SUBJECT"; payload: Subject }
	| { type: "UPDATE_SUBJECT"; payload: Subject }
	| { type: "DELETE_SUBJECT"; payload: string }
	| { type: "MARK_ATTENDANCE"; payload: AttendanceRecord }
	| { type: "SET_LIVE_MODE"; payload: boolean }
	| { type: "LOAD_DATA" };

const initialState: AttendanceState = {
	students: [],
	subjects: [],
	attendanceRecords: [],
	isLiveMode: false,
};

const AttendanceContext = createContext<{
	state: AttendanceState;
	dispatch: React.Dispatch<AttendanceAction>;
	markAttendance: (studentId: string) => void;
	addStudent: (student: Omit<Student, "id" | "createdAt">) => void;
	updateStudent: (student: Student) => void;
	deleteStudent: (studentId: string) => void;
	addSubject: (subject: Omit<Subject, "id" | "createdAt">) => void;
	updateSubject: (subject: Subject) => void;
	deleteSubject: (subjectId: string) => void;
} | null>(null);

function attendanceReducer(state: AttendanceState, action: AttendanceAction): AttendanceState {
	switch (action.type) {
		case "SET_STUDENTS":
			return { ...state, students: action.payload };
		case "ADD_STUDENT":
			return { ...state, students: [...state.students, action.payload] };
		case "UPDATE_STUDENT":
			return {
				...state,
				students: state.students.map((s) =>
					s.id === action.payload.id ? action.payload : s,
				),
			};
		case "DELETE_STUDENT":
			return {
				...state,
				students: state.students.filter((s) => s.id !== action.payload),
				attendanceRecords: state.attendanceRecords.filter(
					(r) => r.studentId !== action.payload,
				),
			};
		case "SET_SUBJECTS":
			return { ...state, subjects: action.payload };
		case "ADD_SUBJECT":
			return { ...state, subjects: [...(state.subjects ?? []), action.payload] };
		case "UPDATE_SUBJECT":
			return {
				...state,
				subjects: (state.subjects ?? []).map((s) =>
					s.id === action.payload.id ? action.payload : s,
				),
			};
		case "DELETE_SUBJECT":
			return {
				...state,
				subjects: (state.subjects ?? []).filter((s) => s.id !== action.payload),
			};
		case "MARK_ATTENDANCE":
			return {
				...state,
				attendanceRecords: [...state.attendanceRecords, action.payload],
			};
		case "SET_LIVE_MODE":
			return { ...state, isLiveMode: action.payload };
		case "LOAD_DATA":
			const storedStudents = JSON.parse(localStorage.getItem("attendance_students") || "[]");
			const storedSubjects = JSON.parse(localStorage.getItem("attendance_subjects") || "[]");
			const storedRecords = JSON.parse(localStorage.getItem("attendance_records") || "[]");
			return {
				...state,
				students: storedStudents,
				subjects: storedSubjects,
				attendanceRecords: storedRecords,
			};
		default:
			return state;
	}
}

export function AttendanceProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(attendanceReducer, initialState);

	useEffect(() => {
		dispatch({ type: "LOAD_DATA" });
	}, []);

	useEffect(() => {
		localStorage.setItem("attendance_students", JSON.stringify(state.students));
	}, [state.students]);

	useEffect(() => {
		localStorage.setItem("attendance_subjects", JSON.stringify(state.subjects));
	}, [state.subjects]);

	useEffect(() => {
		localStorage.setItem("attendance_records", JSON.stringify(state.attendanceRecords));
	}, [state.attendanceRecords]);

	const markAttendance = (studentId: string) => {
		const student = state.students.find((s) => s.id === studentId);
		if (!student) return;

		const today = new Date().toDateString();
		const existingAttendance = state.attendanceRecords.find(
			(r) => r.studentId === studentId && new Date(r.timeIn).toDateString() === today,
		);

		if (existingAttendance) {
			toast.error(`Attendance already marked for ${student.fullName}.`);
			return;
		}

		const attendanceRecord: AttendanceRecord = {
			id: `attendance_${Date.now()}`,
			studentId,
			timeIn: new Date(),
			timeOut: null,
			status: "ENROLLED",
			date: new Date().toDateString(),
		};

		dispatch({ type: "MARK_ATTENDANCE", payload: attendanceRecord });

		toast.success(
			`Attendance Marked,
      ${student.fullName} has been marked present.`,
		);
	};

	const addStudent = (studentData: Omit<Student, "id" | "createdAt">) => {
		const student: Student = {
			...studentData,
			id: `student_${Date.now()}`,
			createdAt: new Date(),
		};
		dispatch({ type: "ADD_STUDENT", payload: student });

		toast(
			`Student Added,
   ${student.fullName} has been registered successfully.`,
		);
	};

	const updateStudent = (student: Student) => {
		dispatch({ type: "UPDATE_STUDENT", payload: student });

		toast(`
      title: "Student Updated",
      ${student.fullName} information has been updated.`);
	};

	const deleteStudent = (studentId: string) => {
		const student = state.students.find((s) => s.id === studentId);
		dispatch({ type: "DELETE_STUDENT", payload: studentId });

		toast.warning(`Student Removed,
      ${student?.fullName} has been removed from the system.`);
	};

	const addSubject = (subjectData: Omit<Subject, "id" | "createdAt">) => {
		const subject: Subject = {
			...subjectData,
			id: `subject_${Date.now()}`,
			createdAt: new Date(),
		};
		dispatch({ type: "ADD_SUBJECT", payload: subject });

		toast.success(
			`Subject Added,
	  ${subject.name} has been added successfully.`,
		);
	};

	const updateSubject = (subject: Subject) => {
		dispatch({ type: "UPDATE_SUBJECT", payload: subject });

		toast.info(
			`Subject Updated,
	  ${subject.name} information has been updated.`,
		);
	};

	const deleteSubject = (subjectId: string) => {
		const subject = (state.subjects ?? []).find((s) => s.id === subjectId);
		dispatch({ type: "DELETE_SUBJECT", payload: subjectId });

		toast.warning(
			`Subject Removed,
	  ${subject?.name} has been removed from the system.`,
		);
	};

	return React.createElement(
		AttendanceContext.Provider,
		{
			value: {
				state,
				dispatch,
				markAttendance,
				addStudent,
				updateStudent,
				deleteStudent,
				addSubject,
				updateSubject,
				deleteSubject,
			},
		},
		children,
	);
}

export const useAttendance = () => {
	const context = useContext(AttendanceContext);
	if (!context) {
		throw new Error("useAttendance must be used within an AttendanceProvider");
	}
	return context;
};
