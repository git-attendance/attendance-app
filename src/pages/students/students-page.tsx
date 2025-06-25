import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Users, Plus, UserCheck, UserX, MoreVertical, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useStudent } from "@/hooks/use-student";
import { useAttendance } from "@/hooks/use-attendance";
import { useAuth } from "@/contexts/auth-context";

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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditStudentModal } from "@/components/modals/edit-student";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import type { StudentModel } from "@/models/student-model";
import Avatar from "@/components/ui/avatar";

const StudentsPage = () => {
	const { getAll, remove } = useStudent();
	const { data: students } = getAll();

	const { getOverallStats, getToday } = useAttendance();
	const { data: stats, isLoading: statsLoading } = getOverallStats();
	const { data: todayAttendance } = getToday;

	const navigate = useNavigate();
	const { user } = useAuth();
	const role = user?.role;

	const [selectedStudent, setSelectedStudent] = useState<StudentModel | null>(null);
	const [isEditOpen, setEditOpen] = useState(false);
	const [isDeleteOpen, setDeleteOpen] = useState(false);

	const handleEdit = (student: StudentModel) => {
		setSelectedStudent(student);
		setEditOpen(true);
	};

	const getStrandColor = (strand?: string) => {
		switch (strand?.toLowerCase()) {
			case "stem":
				return "bg-blue-100 text-blue-800";
			case "humss":
				return "bg-purple-100 text-purple-800";
			case "abm":
				return "bg-green-100 text-green-800";
			case "gas":
				return "bg-orange-100 text-orange-800";
			case "tvl":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// Get today's attendance status for a specific student
	const getStudentTodayStatus = (studentId: string) => {
		const attendanceRecord = todayAttendance?.records?.find(
			(record) => record.studentId._id === studentId,
		);

		if (!attendanceRecord) {
			return {
				status: "absent",
				label: "Absent",
				color: "text-red-600 border-red-200 bg-red-50",
				icon: UserX,
			};
		}

		if (attendanceRecord.attendanceStatus === "present") {
			return {
				status: "present",
				label: "Present",
				color: "text-green-600 border-green-200 bg-green-50",
				icon: UserCheck,
			};
		}

		return {
			status: "absent",
			label: "Absent",
			color: "text-red-600 border-red-200 bg-red-50",
			icon: UserX,
		};
	};

	const handleAddStudent = () => {
		if (!role) {
			toast.error("You do not have permission to add students.");
			return;
		}
		navigate(`/${role}/students/register`);
	};

	const handleDeleteClick = (student: StudentModel) => {
		setSelectedStudent(student);
		setDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedStudent) return;

		try {
			await remove.mutateAsync(selectedStudent._id);
			toast.success("Student deleted successfully.");
		} catch (error) {
			toast.error("Failed to delete student.");
			console.error(error);
		} finally {
			setDeleteOpen(false);
			setSelectedStudent(null);
		}
	};

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const paginatedStudents = (students ?? []).slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	const totalPages = Math.ceil((students?.length ?? 0) / itemsPerPage);

	useEffect(() => {
		setCurrentPage(1);
	}, [students]);

	const PaginationControls = () => {
		if (totalPages <= 1) return null;

		return (
			<div className="flex justify-end items-center gap-2 mt-4">
				<Button
					variant="outline"
					size="sm"
					disabled={currentPage === 1}
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
					Previous
				</Button>
				<span className="text-sm">
					Page {currentPage} of {totalPages}
				</span>
				<Button
					variant="outline"
					size="sm"
					disabled={currentPage === totalPages}
					onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
					Next
				</Button>
			</div>
		);
	};

	// const handleExport = async () => {
	// 	try {
	// 		const { blob, filename } = await exportCSV.mutateAsync();
	// 		const url = window.URL.createObjectURL(blob);
	// 		const link = document.createElement("a");
	// 		link.href = url;
	// 		link.setAttribute("download", filename || "students.csv");
	// 		document.body.appendChild(link);
	// 		link.click();
	// 		link.remove();
	// 		toast.success("Student data exported.");
	// 	} catch (error) {
	// 		console.error(error);
	// 		toast.error("Failed to export student data.");
	// 	}
	// };

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
					<p className="text-gray-600 mt-2">
						Manage student records and view attendance history
					</p>
				</div>
				<div className="flex items-center gap-2">
					{/* <Button onClick={handleExport} variant="outline">
						Export CSV
					</Button> */}
					<Button onClick={handleAddStudent} className="flex items-center gap-2">
						<Plus className="h-4 w-4" />
						Add Student
					</Button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card className="dark:bg-gray-800 dark:text-white">
					<CardContent className="p-4">
						<div className="flex items-center">
							<Users className="h-8 w-8 text-blue-600" />
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-white">
									Total Students
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{students?.length ?? 0}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="dark:bg-gray-800 dark:text-white">
					<CardContent className="p-4">
						<div className="flex items-center">
							<UserCheck className="h-8 w-8 text-green-600" />
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-white">
									Present Today
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{statsLoading ? "..." : (stats?.totalPresent ?? 0)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="dark:bg-gray-800 dark:text-white">
					<CardContent className="p-4">
						<div className="flex items-center">
							<UserX className="h-8 w-8 text-red-600" />
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-white">
									Absent Today
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{statsLoading ? "..." : (stats?.totalAbsent ?? 0)}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="dark:bg-gray-800 dark:text-white">
					<CardContent className="p-4">
						<div className="flex items-center">
							<Users className="h-8 w-8 text-purple-600" />
							<div className="ml-4">
								<p className="text-sm font-medium text-gray-600 dark:text-white">
									Attendance Rate
								</p>
								<p className="text-2xl font-bold text-gray-900 dark:text-white">
									{statsLoading
										? "..."
										: stats?.attendancePercentage
											? `${stats.attendancePercentage}%`
											: "0%"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Students Table */}
			<Card className="dark:bg-gray-800 dark:text-white">
				<CardHeader>
					<CardTitle>Student Directory ({paginatedStudents?.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{paginatedStudents?.length === 0 ? (
						<div className="text-center py-12">
							<Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No Students Yet
							</h3>
							<p className="text-gray-600 mb-4">
								Add your first student to get started with attendance tracking
							</p>
							<Button onClick={handleAddStudent}>Add Your First Student</Button>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Student</TableHead>
										<TableHead>ID</TableHead>
										<TableHead>Grade & Section</TableHead>
										<TableHead>Strand</TableHead>
										<TableHead>Today's Status</TableHead>
										<TableHead>Registered</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{(paginatedStudents ?? []).map((student) => {
										const fullName = `${student.firstName} ${student.lastName}`;
										return (
											<TableRow key={student._id}>
												<TableCell>
													<div className="flex items-center space-x-3">
														<Avatar
															src={student.image}
															alt={`${student.firstName} ${student.lastName}`}
															size="small"
														/>

														<div>
															<p className="font-medium text-gray-900 dark:text-white">
																{fullName}
															</p>
															<p className="text-sm text-gray-500">
																{student.email}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell className="font-mono text-sm">
													{student.studentId}
												</TableCell>
												<TableCell>
													<div>
														<p className="font-medium">
															Grade {student.gradeLevel}
														</p>
														<p className="text-sm text-gray-500">
															Section {student.section}
														</p>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														className={getStrandColor(student.strand)}>
														{student.strand || "N/A"}
													</Badge>
												</TableCell>
												<TableCell>
													{(() => {
														const status = getStudentTodayStatus(
															student._id,
														);
														const Icon = status.icon;
														return (
															<Badge
																variant="outline"
																className={`${status.color} flex items-center gap-1`}>
																<Icon className="h-3 w-3" />
																{status.label}
															</Badge>
														);
													})()}
												</TableCell>
												<TableCell className="text-sm text-gray-500">
													{format(
														new Date(student.createdAt),
														"MMM d, yyyy",
													)}
												</TableCell>
												<TableCell className="text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="sm">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => handleEdit(student)}>
																<Edit className="h-4 w-4 mr-2" />
																Edit Student
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleDeleteClick(student)
																}
																className="text-red-600">
																<Trash2 className="h-4 w-4 mr-2" />
																Delete Student
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
							<PaginationControls />
						</div>
					)}

					<EditStudentModal
						open={isEditOpen}
						onClose={() => setEditOpen(false)}
						student={selectedStudent}
					/>

					<DeleteDialog
						isOpen={isDeleteOpen}
						onClose={() => {
							setDeleteOpen(false);
							setSelectedStudent(null);
						}}
						onConfirm={handleConfirmDelete}
						title="Delete Student"
						description={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName}? This action cannot be undone.`}
						confirmLabel="Delete Student"
						confirmClassName="bg-red-600 hover:bg-red-700"
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default StudentsPage;
