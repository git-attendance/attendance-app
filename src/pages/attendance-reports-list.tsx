import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Download, Users, Calendar, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useAttendance } from "@/hooks/use-attendance";
import { useStudent } from "@/hooks/use-student";
import { toast } from "sonner";
import type { StudentModel, StudentRemarks } from "@/models/student-model";

const AttendanceList = () => {
	const { getToday } = useAttendance();
	const { data: todayData = { records: [], present: 0, absent: 0 } } = getToday;
	const { getAll, update } = useStudent();
	const { data: students = [] } = getAll();
	const updateStudent = update;
	const [selectedDate, setSelectedDate] = useState<string>("today");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [editingId, setEditingId] = useState<string | null>(null);

	const ITEMS_PER_PAGE = 10;

	const attendanceMap = useMemo(() => {
		const map = new Map<string, string>();
		todayData.records.forEach((rec) => map.set(rec.studentId, "Present"));
		return map;
	}, [todayData.records]);

	const enrichedData = useMemo(() => {
		return students.map((student) => {
			const status = attendanceMap.get(student._id) ?? "Absent";
			const attendance = todayData.records.find((r) => r.studentId === student._id);
			return {
				...student,
				status,
				timeIn: attendance ? format(new Date(attendance.checkInTime), "HH:mm") : "-",
				date: format(new Date(), "MMM dd, yyyy"),
			};
		});
	}, [students, attendanceMap, todayData.records]);

	const filteredData = useMemo(() => {
		const filtered = enrichedData.filter((item) => {
			const matchesStatus =
				selectedStatus === "all" ||
				item.status.toLowerCase() === selectedStatus.toLowerCase();
			return matchesStatus;
		});
		return filtered.sort((a) => (a.status === "Present" ? -1 : 1));
	}, [enrichedData, selectedStatus]);

	const paginatedData = useMemo(() => {
		const start = (page - 1) * ITEMS_PER_PAGE;
		return filteredData.slice(start, start + ITEMS_PER_PAGE);
	}, [filteredData, page]);

	const presentCount = filteredData.filter((item) => item.status === "Present").length;
	const absentCount = filteredData.filter((item) => item.status === "Absent").length;

	const exportToCSV = () => {
		const headers = [
			"Student ID",
			"Full Name",
			"Grade",
			"Section",
			"Strand",
			"Status",
			"Time In",
			"Date",
			"Remarks",
		];
		const csvContent = [
			headers.join(","),
			...filteredData.map((item) =>
				[
					item.studentId,
					`"${item.firstName} ${item.lastName}"`,
					item.gradeLevel,
					item.section,
					item.strand || "",
					item.status,
					item.timeIn,
					item.date,
					`"${item.remarks || ""}"`,
				].join(","),
			),
		].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = `attendance_list_${format(new Date(), "yyyy-MM-dd")}.csv`;
		link.click();
	};

	const handleInlineUpdate = async (student: StudentModel, remarks: StudentRemarks) => {
		await updateStudent.mutateAsync({ ...student, remarks });
		toast.success("Remarks updated");
		setEditingId(null);
	};

	return (
		<div className="p-6 space-y-6 min-h-screen">
			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Attendance Reports / List
				</h1>
				<div className="flex flex-col sm:flex-row gap-4">
					<Select value={selectedDate} onValueChange={setSelectedDate}>
						<SelectTrigger className="w-[200px]">
							<Calendar className="h-4 w-4 mr-2" />
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="yesterday">Yesterday</SelectItem>
						</SelectContent>
					</Select>
					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="w-[150px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="present">Present</SelectItem>
							<SelectItem value="absent">Absent</SelectItem>
						</SelectContent>
					</Select>
					<Button onClick={exportToCSV} className="flex items-center gap-2">
						<Download className="h-4 w-4" /> Export to CSV
					</Button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-gray-50 dark:bg-gray-800">
					<CardContent className="p-4 flex items-center">
						<Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Total Students
							</p>
							<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
								{filteredData.length}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-gray-50 dark:bg-gray-800">
					<CardContent className="p-4 flex items-center">
						<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
							<span className="text-green-600 dark:text-green-300 font-bold">✓</span>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Present
							</p>
							<p className="text-2xl font-bold text-green-600 dark:text-green-300">
								{presentCount}
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-gray-50 dark:bg-gray-800">
					<CardContent className="p-4 flex items-center">
						<div className="h-8 w-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
							<span className="text-red-600 dark:text-red-300 font-bold">✗</span>
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								Absent
							</p>
							<p className="text-2xl font-bold text-red-600 dark:text-red-300">
								{absentCount}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="bg-gray-50 dark:bg-gray-800">
				<CardHeader>
					<CardTitle>Attendance Records ({filteredData.length})</CardTitle>
				</CardHeader>
				<CardContent className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Student ID</TableHead>
								<TableHead>Full Name</TableHead>
								<TableHead>Grade</TableHead>
								<TableHead>Section</TableHead>
								<TableHead>Strand</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Time In</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Remarks</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedData.map((item) => (
								<TableRow key={item._id}>
									<TableCell>{item.studentId}</TableCell>
									<TableCell>
										{item.firstName} {item.lastName}
									</TableCell>
									<TableCell>{item.gradeLevel}</TableCell>
									<TableCell>{item.section}</TableCell>
									<TableCell>{item.strand || "-"}</TableCell>
									<TableCell>
										<Badge
											className={
												item.status === "Present"
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}>
											{item.status}
										</Badge>
									</TableCell>
									<TableCell>{item.timeIn}</TableCell>
									<TableCell>{item.date}</TableCell>
									<TableCell>
										{editingId === item._id ? (
											<div className="flex items-center gap-2">
												<Select
													value={item.remarks || "none"}
													onValueChange={(val) =>
														handleInlineUpdate(
															item,
															val as StudentRemarks,
														)
													}>
													<SelectTrigger className="w-[160px] h-8">
														<SelectValue placeholder="Remarks" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="none">None</SelectItem>
														<SelectItem value="excuse">
															Excuse
														</SelectItem>
														<SelectItem value="late">Late</SelectItem>
														<SelectItem value="early_dismissal">
															Early Dismissal
														</SelectItem>
														<SelectItem value="sick">Sick</SelectItem>
														<SelectItem value="family_emergency">
															Family Emergency
														</SelectItem>
														<SelectItem value="medical_appointment">
															Medical Appointment
														</SelectItem>
														<SelectItem value="official_business">
															Official Business
														</SelectItem>
														<SelectItem value="suspension">
															Suspension
														</SelectItem>
														<SelectItem value="good_standing">
															Good Standing
														</SelectItem>
													</SelectContent>
												</Select>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setEditingId(null)}
													aria-label="Cancel">
													<span className="text-lg leading-none">
														&times;
													</span>
												</Button>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<span>{item.remarks || "None"}</span>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setEditingId(item._id)}>
													<Pencil className="w-4 h-4" />
												</Button>
											</div>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<div className="flex justify-center gap-4 pt-4">
				<Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
					Previous
				</Button>
				<Button
					disabled={page * ITEMS_PER_PAGE >= filteredData.length}
					onClick={() => setPage((p) => p + 1)}>
					Next
				</Button>
			</div>
		</div>
	);
};

export default AttendanceList;
