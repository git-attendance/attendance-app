import { useMutation, useQuery } from "@tanstack/react-query";
import { AttendanceService } from "@/services/attendance-service";
import { toast } from "sonner";
import type { AttendanceSummaryResponse } from "@/models/attendance-model";

const attendanceService = new AttendanceService();

export function useAttendance() {
	const getToday = useQuery<AttendanceSummaryResponse>({
		queryKey: ["attendance", "today"],
		queryFn: () => attendanceService.getTodayRecords(),
	});

	// Enroll student face
	const enrollFace = useMutation({
		mutationFn: (payload: { photo: File; studentId: string }) =>
			attendanceService.enrollFace(payload.photo, payload.studentId),
		onSuccess: (res) => {
			toast.success(res.message || "Face enrolled successfully");
		},
		onError: (err: any) => {
			toast.error(err?.error?.message || "Failed to enroll face");
		},
	});

	// Process attendance (check-in/check-out)
	const process = useMutation({
		mutationFn: (payload: { photo: File; subjectId: string }) =>
			attendanceService.processAttendance(payload.photo, payload.subjectId),
		onSuccess: (res) => {
			toast.success(res.message || "Attendance recorded");
		},
		onError: (err: any) => {
			toast.error(err?.error?.message || "Failed to process attendance");
		},
	});

	// Get attendance history
	const getHistory = (subjectId?: string, startDate?: Date, endDate?: Date) =>
		useQuery({
			queryKey: ["attendance", "history", subjectId, startDate, endDate],
			queryFn: () => attendanceService.getAttendanceHistory(subjectId, startDate, endDate),
		});

	// Get student subject status
	const getStudentStatus = (
		studentId: string,
		subjectId: string,
		startDate?: Date,
		endDate?: Date,
	) =>
		useQuery({
			queryKey: ["attendance", "student-status", studentId, subjectId, startDate, endDate],
			queryFn: () =>
				attendanceService.getStudentStatus(studentId, subjectId, startDate, endDate),
			enabled: !!studentId && !!subjectId,
		});

	// Get subject stats
	const getSubjectStats = (subjectId?: string, startDate?: Date, endDate?: Date) =>
		useQuery({
			queryKey: ["attendance", "subject-stats", subjectId, startDate, endDate],
			queryFn: () => attendanceService.getSubjectStats(subjectId, startDate, endDate),
		});

	// Note: getSubjectStudentsStatus has been deprecated - use getSubjectStats or getOverallStats instead
	// Get all student statuses in subject
	// const getSubjectStudentsStatus = (subjectId: string, startDate?: Date, endDate?: Date) =>
	// 	useQuery({
	// 		queryKey: ["attendance", "students-status", subjectId, startDate, endDate],
	// 		queryFn: () =>
	// 			attendanceService.getSubjectStudentsStatus(subjectId, startDate, endDate),
	// 		enabled: !!subjectId,
	// 	});

	// Test SMS
	const testSMS = useMutation({
		mutationFn: (phoneNumber: string) => attendanceService.testSMS(phoneNumber),
		onSuccess: (res) => {
			toast.success(res.message || "Test SMS sent successfully");
		},
		onError: (err: any) => {
			toast.error(err?.error?.message || "Failed to send test SMS");
		},
	});

	// Get overall stats
	const getOverallStats = (filters?: {
		studentId?: string;
		subjectId?: string;
		startDate?: Date;
		endDate?: Date;
	}) =>
		useQuery({
			queryKey: ["attendance", "overall-stats", filters],
			queryFn: () => attendanceService.getOverallStats(filters),
		});

	// Export attendance to CSV
	const exportCSV = useMutation({
		mutationFn: (subjectId?: string) => attendanceService.exportAttendanceCSV(subjectId),
		onError: (err: any) => {
			toast.error(err?.error?.message || "Failed to export attendance");
		},
	});

	return {
		// Queries
		getToday,
		getHistory,
		getStudentStatus,
		getSubjectStats,
		getOverallStats,

		// Mutations
		enrollFace,
		process,
		testSMS,
		exportCSV,
	};
}
