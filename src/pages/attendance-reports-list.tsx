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
import { Download, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useAttendance } from "@/contexts/attendance-context";

const AttendanceList = () => {
	const { state } = useAttendance();

	const [selectedDate, setSelectedDate] = useState<string>("today");
	const [selectedStatus, setSelectedStatus] = useState<string>("all");

	// Get attendance data based on filters
	const attendanceData = useMemo(() => {
		let targetDate: Date;

		if (selectedDate === "today") {
			targetDate = new Date();
		} else if (selectedDate === "yesterday") {
			targetDate = new Date();
			targetDate.setDate(targetDate.getDate() - 1);
		} else {
			targetDate = new Date(selectedDate);
		}

		const targetDateStr = targetDate.toDateString();

		return state.students.map((student) => {
			const attendanceRecord = state.attendanceRecords.find(
				(record) =>
					record.studentId === student.id &&
					new Date(record.timeIn).toDateString() === targetDateStr,
			);

			const status = attendanceRecord ? "Present" : "Absent";
			const timeIn = attendanceRecord
				? format(new Date(attendanceRecord.timeIn), "HH:mm")
				: "-";

			const remarks =
				attendanceRecord?.remarks ?? (status === "Absent" ? "No reason given" : "");

			return {
				...student,
				status,
				timeIn,
				date: format(targetDate, "MMM dd, yyyy"),
				remarks,
			};
		});
	}, [state.students, state.attendanceRecords, selectedDate]);

	// Filter data based on search and status
	const filteredData = useMemo(() => {
		return attendanceData.filter((item) => {
			const matchesStatus =
				selectedStatus === "all" ||
				item.status.toLowerCase() === selectedStatus.toLowerCase();

			return matchesStatus;
		});
	}, [attendanceData, selectedStatus]);

	// CSV Export functionality
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
					`"${item.fullName}"`,
					item.grade,
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
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `attendance_list_${format(new Date(), "yyyy-MM-dd")}.csv`);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const presentCount = filteredData.filter((item) => item.status === "Present").length;
	const absentCount = filteredData.filter((item) => item.status === "Absent").length;

	return (
		<div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Attendance Reports / List
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						View and export student attendance records
					</p>
				</div>

				<div className="flex flex-col sm:flex-row gap-4">
					<Select value={selectedDate} onValueChange={setSelectedDate}>
						<SelectTrigger className="w-[200px] bg-white dark:bg-gray-900 dark:text-gray-100">
							<Calendar className="h-4 w-4 mr-2" />
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white dark:bg-gray-900 dark:text-gray-100">
							<SelectItem value="today">Today</SelectItem>
							<SelectItem value="yesterday">Yesterday</SelectItem>
						</SelectContent>
					</Select>

					<Select value={selectedStatus} onValueChange={setSelectedStatus}>
						<SelectTrigger className="w-[150px] bg-white dark:bg-gray-900 dark:text-gray-100">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white dark:bg-gray-900 dark:text-gray-100">
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="present">Present</SelectItem>
							<SelectItem value="absent">Absent</SelectItem>
						</SelectContent>
					</Select>

					<Button onClick={exportToCSV} className="flex items-center gap-2">
						<Download className="h-4 w-4" />
						Export to CSV
					</Button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-white dark:bg-gray-800">
					<CardContent className="p-4">
						<div className="flex items-center">
							<Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Total Students
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
									{filteredData.length}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white dark:bg-gray-800">
					<CardContent className="p-4">
						<div className="flex items-center">
							<div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
								<span className="text-green-600 dark:text-green-300 font-bold">
									✓
								</span>
							</div>
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
									Present
								</p>
								<p className="text-2xl font-bold text-green-600 dark:text-green-300">
									{presentCount}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="bg-white dark:bg-gray-800">
					<CardContent className="p-4">
						<div className="flex items-center">
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
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Attendance Table */}
			<Card className="bg-white dark:bg-gray-800">
				<CardHeader>
					<CardTitle className="dark:text-gray-100">
						Attendance Records ({filteredData.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredData.length === 0 ? (
						<div className="text-center py-12">
							<Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
								No Records Found
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Try adjusting your search criteria or filters
							</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="dark:text-gray-300">
											Student ID
										</TableHead>
										<TableHead className="dark:text-gray-300">
											Full Name
										</TableHead>
										<TableHead className="dark:text-gray-300">Grade</TableHead>
										<TableHead className="dark:text-gray-300">
											Section
										</TableHead>
										<TableHead className="dark:text-gray-300">Strand</TableHead>
										<TableHead className="dark:text-gray-300">Status</TableHead>
										<TableHead className="dark:text-gray-300">
											Time In
										</TableHead>
										<TableHead className="dark:text-gray-300">Date</TableHead>
										<TableHead className="dark:text-gray-300">
											Remarks
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredData.map((item) => (
										<TableRow key={item.id} className="dark:hover:bg-gray-700">
											<TableCell className="font-mono text-sm dark:text-gray-100">
												{item.studentId}
											</TableCell>
											<TableCell className="font-medium dark:text-gray-100">
												{item.fullName}
											</TableCell>
											<TableCell className="dark:text-gray-100">
												{item.grade}
											</TableCell>
											<TableCell className="dark:text-gray-100">
												{item.section}
											</TableCell>
											<TableCell>
												{item.strand ? (
													<Badge
														variant="outline"
														className="dark:border-gray-600 dark:text-gray-100">
														{item.strand}
													</Badge>
												) : (
													<span className="text-gray-400 dark:text-gray-500">
														-
													</span>
												)}
											</TableCell>
											<TableCell>
												<Badge
													variant={
														item.status === "Present"
															? "default"
															: "secondary"
													}
													className={
														item.status === "Present"
															? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
															: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
													}>
													{item.status}
												</Badge>
											</TableCell>
											<TableCell className="font-mono text-sm dark:text-gray-100">
												{item.timeIn}
											</TableCell>
											<TableCell className="text-sm text-gray-600 dark:text-gray-400">
												{item.date}
											</TableCell>
											<TableCell className="text-sm text-gray-600 dark:text-gray-400">
												{item.remarks || "No remarks"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default AttendanceList;
