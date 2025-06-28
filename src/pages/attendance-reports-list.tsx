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
import type { StudentRemarks } from "@/models/student-model";

const ITEMS_PER_PAGE = 10;

const AttendanceList = () => {
	const { getToday, exportCSV } = useAttendance();
	const { data: todayData = { records: [], present: 0, absent: 0 } } = getToday;
	const { update: updateStudent, exportCSV: exportStudentsCSV } = useStudent();

	const [selectedDate, setSelectedDate] = useState<string>("today");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [editingId, setEditingId] = useState<string | null>(null);

	const enrichedData = useMemo(() => {
		return todayData.records.map((record) => {
			const student = record.studentId;

			// Handle deleted students (null studentId)
			if (!student) {
				return {
					_id: `deleted-${Math.random()}`, // Generate a unique ID for deleted students
					studentId: "N/A",
					firstName: "[Deleted",
					lastName: "Student]",
					gradeLevel: "N/A",
					section: "N/A",
					strand: "N/A",
					remarks: "Student record deleted",
					status: record.attendanceStatus === "present" ? "Present" : "Absent",
					timeIn: record.checkInTime
						? format(new Date(record.checkInTime), "HH:mm")
						: "-",
					timeOut: record.checkOutTime
						? format(new Date(record.checkOutTime), "HH:mm")
						: "-",
					date: format(new Date(), "MMM dd, yyyy"),
					isDeleted: true, // Flag to identify deleted students
				};
			}

			// Handle normal students
			return {
				_id: student._id,
				studentId: student.studentId || student._id || "No ID", // Fallback to _id if studentId is missing
				firstName: student.firstName,
				lastName: student.lastName,
				gradeLevel: student.gradeLevel,
				section: student.section,
				strand: student.strand || "-",
				remarks: student.remarks || "none",
				status: record.attendanceStatus === "present" ? "Present" : "Absent",
				timeIn: record.checkInTime ? format(new Date(record.checkInTime), "HH:mm") : "-",
				timeOut: record.checkOutTime ? format(new Date(record.checkOutTime), "HH:mm") : "-",
				date: format(new Date(), "MMM dd, yyyy"),
				isDeleted: false,
			};
		});
	}, [todayData.records]);

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

	const handleInlineUpdate = async (student: any, remarks: StudentRemarks) => {
		await updateStudent.mutateAsync({ ...student, remarks });
		toast.success("Remarks updated");
		setEditingId(null);
	};

	const handleExportToday = async () => {
		try {
			const csvData = await exportCSV.mutateAsync(undefined);

			// Create blob from CSV data
			const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

			// Create download link
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`attendance-today-${format(new Date(), "yyyy-MM-dd")}.csv`,
			);
			link.style.visibility = "hidden";

			// Trigger download
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast.success("Attendance exported successfully");
		} catch (error) {
			console.error("Export failed:", error);
		}
	};

	const handleExportAll = async () => {
		try {
			const csvData = await exportStudentsCSV.mutateAsync();

			// Create blob from CSV data
			const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

			// Create download link
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", `all-students-${format(new Date(), "yyyy-MM-dd")}.csv`);
			link.style.visibility = "hidden";

			// Trigger download
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast.success("Students exported successfully");
		} catch (error) {
			console.error("Export failed:", error);
		}
	};

	return (
		<div className="p-6 space-y-6 min-h-screen">
			{/* Header + Filters */}
			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
				<h1 className="text-3xl font-bold">Attendance Reports / List</h1>
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
					<Button onClick={handleExportAll}>
						<Download className="w-4 h-4 mr-2" /> Export All
					</Button>
					<Button onClick={handleExportToday}>
						<Download className="w-4 h-4 mr-2" /> Export Today
					</Button>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-gray-50 dark:bg-gray-800">
					<CardContent className="p-4 flex items-center">
						<Users className="h-8 w-8 text-blue-600" />
						<div className="ml-4">
							<p className="text-sm text-gray-600">Total Students</p>
							<p className="text-2xl font-bold">{filteredData.length}</p>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-gray-50 dark:bg-gray-800">
					<CardContent className="p-4 flex items-center">
						<div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
							<span className="text-green-600 font-bold">✓</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Present</p>
							<p className="text-2xl font-bold text-green-600">{presentCount}</p>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-gray-50 dark:bg-gray-800">
					<CardContent className="p-4 flex items-center">
						<div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
							<span className="text-red-600 font-bold">✗</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Absent</p>
							<p className="text-2xl font-bold text-red-600">{absentCount}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Attendance Table */}
			<Card className="dark:bg-gray-800">
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
								<TableHead>Time Out</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Remarks</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedData.map((item) => (
								<TableRow
									key={item._id}
									className={
										item.isDeleted
											? "opacity-60 bg-gray-50 dark:bg-gray-900"
											: ""
									}>
									<TableCell>{item.studentId}</TableCell>
									<TableCell>
										<span
											className={
												item.isDeleted ? "italic text-gray-500" : ""
											}>
											{item.firstName} {item.lastName}
										</span>
									</TableCell>
									<TableCell>{item.gradeLevel}</TableCell>
									<TableCell>{item.section}</TableCell>
									<TableCell>{item.strand}</TableCell>
									<TableCell>
										<Badge
											className={
												item.status === "Present"
													? "bg-green-100 text-green-800"
													: item.status === "Absent"
														? "bg-red-100 text-red-800"
														: "bg-gray-200 text-gray-700"
											}>
											{item.status}
										</Badge>
									</TableCell>
									<TableCell>{item.timeIn}</TableCell>
									<TableCell>{item.timeOut}</TableCell>
									<TableCell>{item.date}</TableCell>
									<TableCell>
										{item.isDeleted ? (
											<span className="text-gray-500 italic">
												{item.remarks}
											</span>
										) : editingId === item._id ? (
											<div className="flex items-center gap-2">
												<Select
													value={item.remarks}
													onValueChange={(val) =>
														handleInlineUpdate(
															item,
															val as StudentRemarks,
														)
													}>
													<SelectTrigger className="w-[160px] h-8">
														<SelectValue />
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
													onClick={() => setEditingId(null)}>
													&times;
												</Button>
											</div>
										) : (
											<div className="flex items-center gap-2">
												<span>{item.remarks}</span>
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

			{/* Pagination */}
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
