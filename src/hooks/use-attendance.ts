import { useQuery } from "@tanstack/react-query";
import { AttendanceService } from "@/services/attendance-service";

const attendanceService = new AttendanceService();

export const attendanceKeys = {
	today: ["attendance", "today"],
	student: (id: string) => ["attendance", "student", id],
	statusByStudentSubject: (studentId: string, subjectId: string) => [
		"attendance",
		"student",
		studentId,
		"subject",
		subjectId,
	],
	bySubject: (subjectId: string) => ["attendance", "subject", subjectId],
	stats: (subjectId: string) => ["attendance", "subject", subjectId, "stats"],
	studentsStatus: (subjectId: string) => ["attendance", "subject", subjectId, "students"],
};

export const useTodayAttendance = () =>
	useQuery({
		queryKey: attendanceKeys.today,
		queryFn: () => attendanceService.getTodayRecords(),
	});

export const useStudentAttendanceHistory = (studentId: string) =>
	useQuery({
		queryKey: attendanceKeys.student(studentId),
		queryFn: () => attendanceService.getStudentHistory(studentId),
		enabled: !!studentId,
	});

export const useStudentAttendanceStatus = (studentId: string, subjectId: string) =>
	useQuery({
		queryKey: attendanceKeys.statusByStudentSubject(studentId, subjectId),
		queryFn: () => attendanceService.getStudentStatus(studentId, subjectId),
		enabled: !!studentId && !!subjectId,
	});

export const useSubjectAttendanceRecords = (subjectId: string) =>
	useQuery({
		queryKey: attendanceKeys.bySubject(subjectId),
		queryFn: () => attendanceService.getSubjectRecords(subjectId),
		enabled: !!subjectId,
	});

export const useSubjectAttendanceStats = (subjectId: string) =>
	useQuery({
		queryKey: attendanceKeys.stats(subjectId),
		queryFn: () => attendanceService.getSubjectStats(subjectId),
		enabled: !!subjectId,
	});

export const useSubjectStudentsAttendanceStatus = (subjectId: string) =>
	useQuery({
		queryKey: attendanceKeys.studentsStatus(subjectId),
		queryFn: () => attendanceService.getSubjectStudentsStatus(subjectId),
		enabled: !!subjectId,
	});
