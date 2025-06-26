import { useState } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Users, CreditCard, Shield, GraduationCap, MoreVertical, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useDeleteUser, useUsers } from "@/hooks/use-user";
import { useStudent } from "@/hooks/use-student";
import type { UserModel } from "@/models/user-model";
import type { StudentModel } from "@/models/student-model";
import { AddTeacherModal } from "@/components/modals/add-teacher";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { EditUserModal } from "@/components/modals/edit-teacher";

const AccountsPage = () => {
	const { data: users = [] } = useUsers();
	const { getAll: getAllStudents } = useStudent();
	const students = getAllStudents().data ?? [];
	const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
	const [isEditUserOpen, setEditUserOpen] = useState(false);
	const [isDeleteUserOpen, setDeleteUserOpen] = useState(false);

	const [userSearch, setUserSearch] = useState("");
	const [studentSearch, setStudentSearch] = useState("");
	const [selectedRole, setSelectedRole] = useState<string>("all");
	const [selectedStrand, setSelectedStrand] = useState<string>("all");

	const getStrandColor = (strand: string | undefined) => {
		switch ((strand ?? "").toLowerCase()) {
			case "stem":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "humss":
				return "bg-purple-100 text-purple-800 border-purple-200";
			case "abm":
				return "bg-green-100 text-green-800 border-green-200";
			case "gas":
				return "bg-orange-100 text-orange-800 border-orange-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getRoleColor = (role: string) => {
		switch (role?.toLowerCase()) {
			case "admin":
				return "bg-red-100 text-red-800 border-red-200";
			case "teacher":
				return "bg-blue-100 text-blue-800 border-blue-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const filteredUsers = users.filter((u: UserModel) => {
		const matchesSearch =
			u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
			u.email.toLowerCase().includes(userSearch.toLowerCase());

		const matchesRole = selectedRole === "all" || u.role === selectedRole;

		return matchesSearch && matchesRole;
	});

	const filteredStudents = students.filter((s: StudentModel) => {
		const fullName = `${s.firstName} ${s.middleName ?? ""} ${s.lastName}`.toLowerCase();
		const matchesSearch =
			fullName.includes(studentSearch.toLowerCase()) ||
			s.email.toLowerCase().includes(studentSearch.toLowerCase());

		const matchesStrand = selectedStrand === "all" || s.strand === selectedStrand;

		return matchesSearch && matchesStrand;
	});

	const totalUsers = users.length;
	const totalStudents = students.length;
	const totalAccounts = totalUsers + totalStudents;
	const adminCount = users.filter((u: UserModel) => u.role === "admin").length;
	const teacherCount = users.filter((u: UserModel) => u.role === "teacher").length;

	const [userPage, setUserPage] = useState(1);
	const [studentPage, setStudentPage] = useState(1);
	const itemsPerPage = 10;

	const handleEditUser = (user: UserModel) => {
		setSelectedUser(user);
		setEditUserOpen(true);
	};

	const handleDeleteUserClick = (user: UserModel) => {
		setSelectedUser(user);
		setDeleteUserOpen(true);
	};

	const { mutateAsync: deleteUser } = useDeleteUser();

	const handleConfirmDeleteUser = async () => {
		if (!selectedUser) return;
		try {
			await deleteUser(selectedUser._id);
			toast.success("User deleted successfully.");
		} catch {
			toast.error("Failed to delete user.");
		} finally {
			setDeleteUserOpen(false);
			setSelectedUser(null);
		}
	};

	const paginatedUsers = filteredUsers.slice(
		(userPage - 1) * itemsPerPage,
		userPage * itemsPerPage,
	);

	const paginatedStudents = filteredStudents.slice(
		(studentPage - 1) * itemsPerPage,
		studentPage * itemsPerPage,
	);

	const PaginationControls = ({
		currentPage,
		totalItems,
		onPageChange,
	}: {
		currentPage: number;
		totalItems: number;
		onPageChange: (page: number) => void;
	}) => {
		const totalPages = Math.ceil(totalItems / itemsPerPage);

		if (totalPages <= 1) return null;

		return (
			<div className="flex justify-end items-center gap-2 mt-4">
				<button
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}
					className="text-sm px-2 py-1 border rounded disabled:opacity-50">
					Previous
				</button>
				<span className="text-sm">
					Page {currentPage} of {totalPages}
				</span>
				<button
					disabled={currentPage === totalPages}
					onClick={() => onPageChange(currentPage + 1)}
					className="text-sm px-2 py-1 border rounded disabled:opacity-50">
					Next
				</button>
			</div>
		);
	};

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
						Accounts
					</h1>
					<p className="text-gray-500 dark:text-gray-300 mt-1 text-lg">
						Manage all user accounts and students in the system
					</p>
				</div>
				<AddTeacherModal />
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow-md p-4">
					<CardContent className="p-6 flex items-center gap-4">
						<div className="flex-1">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-300">
								Total Accounts
							</p>
							<p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
								{totalAccounts}
							</p>
						</div>
						<div className="p-3 rounded-full bg-blue-200 dark:bg-blue-900/30">
							<Users className="h-7 w-7 text-blue-700 dark:text-blue-300" />
						</div>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 shadow-md p-4">
					<CardContent className="p-6 flex items-center gap-4">
						<div className="flex-1">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-300">
								Admin Users
							</p>
							<p className="text-3xl font-bold text-red-900 dark:text-red-200">
								{adminCount}
							</p>
						</div>
						<div className="p-3 rounded-full bg-red-200 dark:bg-red-900/30">
							<Shield className="h-7 w-7 text-red-700 dark:text-red-300" />
						</div>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 shadow-md p-4">
					<CardContent className="p-6 flex items-center gap-4">
						<div className="flex-1">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-300">
								Teachers
							</p>
							<p className="text-3xl font-bold text-blue-900 dark:text-blue-200">
								{teacherCount}
							</p>
						</div>
						<div className="p-3 rounded-full bg-blue-200 dark:bg-blue-900/30">
							<CreditCard className="h-7 w-7 text-blue-700 dark:text-blue-300" />
						</div>
					</CardContent>
				</Card>
				<Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 shadow-md p-4">
					<CardContent className="p-6 flex items-center gap-4">
						<div className="flex-1">
							<p className="text-sm font-medium text-gray-600 dark:text-gray-300">
								Students
							</p>
							<p className="text-3xl font-bold text-green-900 dark:text-green-200">
								{totalStudents}
							</p>
						</div>
						<div className="p-3 rounded-full bg-green-200 dark:bg-green-900/30">
							<GraduationCap className="h-7 w-7 text-green-700 dark:text-green-300" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="users" className="space-y-6">
				<TabsList className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit mx-auto shadow">
					<TabsTrigger value="users" className="px-6 py-2 text-base">
						System Users
					</TabsTrigger>
					<TabsTrigger value="students" className="px-6 py-2 text-base">
						Students
					</TabsTrigger>
				</TabsList>

				{/* USERS TABLE */}
				<TabsContent value="users">
					<Card className="dark:bg-gray-900 bg-white shadow-lg p-4">
						<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-800">
							<CardTitle className="text-xl font-bold">System Users</CardTitle>
							<div className="flex gap-4 w-full md:w-auto flex-col md:flex-row">
								<Input
									placeholder="Search name or email..."
									value={userSearch}
									onChange={(e) => setUserSearch(e.target.value)}
									className="rounded-lg border-gray-300 dark:border-gray-700"
								/>
								<Select onValueChange={setSelectedRole} value={selectedRole}>
									<SelectTrigger className="w-full md:w-[180px] rounded-lg border-gray-300 dark:border-gray-700">
										<SelectValue placeholder="Filter by role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Roles</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
										<SelectItem value="teacher">Teacher</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							{paginatedUsers.length === 0 ? (
								<div className="text-center py-12 text-gray-400 dark:bg-blue-900/10">
									<Users className="h-14 w-14 mx-auto mb-4 text-gray-300" />
									<p className="text-lg">No users found.</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Role</TableHead>
												<TableHead>Email</TableHead>
												<TableHead>User ID</TableHead>
												<TableHead>Created</TableHead>
												<TableHead className="text-right">
													Actions
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{paginatedUsers.map((user: any) => (
												<TableRow
													key={user._id}
													className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition">
													<TableCell className="font-semibold">
														{user.name}
													</TableCell>
													<TableCell>
														<Badge
															className={
																getRoleColor(user.role) +
																" px-3 py-1 rounded-full text-xs"
															}>
															{user.role.charAt(0).toUpperCase() +
																user.role.slice(1)}
														</Badge>
													</TableCell>
													<TableCell>{user.email}</TableCell>
													<TableCell>
														<span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
															{user._id.slice(-8)}
														</span>
													</TableCell>
													<TableCell>
														{format(
															new Date(user.createdAt),
															"MMM d, yyyy",
														)}
													</TableCell>
													<TableCell className="text-right">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	className="hover:bg-gray-100 dark:hover:bg-gray-800">
																	<MoreVertical className="h-5 w-5" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end">
																<DropdownMenuItem
																	onClick={() =>
																		handleEditUser(user)
																	}>
																	<Edit className="h-4 w-4 mr-2" />
																	Edit User
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		handleDeleteUserClick(user)
																	}
																	className="text-red-600">
																	<Trash2 className="h-4 w-4 mr-2" />
																	Delete User
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
							<PaginationControls
								currentPage={userPage}
								totalItems={filteredUsers.length}
								onPageChange={setUserPage}
							/>
						</CardContent>
					</Card>
				</TabsContent>

				{/* STUDENTS TABLE */}
				<TabsContent value="students">
					<Card className="dark:bg-gray-900 bg-white shadow-lg p-4">
						<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 dark:border-gray-800">
							<CardTitle className="text-xl font-bold">Students</CardTitle>
							<div className="flex gap-4 w-full md:w-auto flex-col md:flex-row">
								<Input
									placeholder="Search name or email..."
									value={studentSearch}
									onChange={(e) => setStudentSearch(e.target.value)}
									className="rounded-lg border-gray-300 dark:border-gray-700"
								/>
								<Select onValueChange={setSelectedStrand} value={selectedStrand}>
									<SelectTrigger className="w-full md:w-[180px] rounded-lg border-gray-300 dark:border-gray-700">
										<SelectValue placeholder="Filter by strand" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Strands</SelectItem>
										<SelectItem value="STEM">STEM</SelectItem>
										<SelectItem value="ABM">ABM</SelectItem>
										<SelectItem value="HUMSS">HUMSS</SelectItem>
										<SelectItem value="GAS">GAS</SelectItem>
										<SelectItem value="TVL">TVL</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent className="p-0">
							{paginatedStudents.length === 0 ? (
								<div className="text-center py-12 text-gray-400 dark:bg-blue-900/10">
									<GraduationCap className="h-14 w-14 mx-auto mb-4 text-gray-300" />
									<p className="text-lg">No students found.</p>
								</div>
							) : (
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Name</TableHead>
												<TableHead>Email</TableHead>
												<TableHead>Student ID</TableHead>
												<TableHead>Grade & Section</TableHead>
												<TableHead>Strand</TableHead>
												<TableHead>Created</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{paginatedStudents.map((student) => (
												<TableRow
													key={student._id}
													className="hover:bg-green-50/40 dark:hover:bg-green-900/10 transition">
													<TableCell className="font-semibold">
														{student.firstName} {student.middleName}{" "}
														{student.lastName}
													</TableCell>
													<TableCell>{student.email}</TableCell>
													<TableCell>
														<span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
															{student.studentId}
														</span>
													</TableCell>
													<TableCell>
														{student.gradeLevel} - {student.section}
													</TableCell>
													<TableCell>
														<Badge
															className={
																getStrandColor(student.strand) +
																" px-3 py-1 rounded-full text-xs"
															}>
															{student.strand
																? student.strand
																: "N/A"}
														</Badge>
													</TableCell>
													<TableCell>
														{format(
															new Date(student.createdAt),
															"MMM d, yyyy",
														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</CardContent>
					</Card>
					<PaginationControls
						currentPage={studentPage}
						totalItems={filteredStudents.length}
						onPageChange={setStudentPage}
					/>
				</TabsContent>
			</Tabs>

			<EditUserModal
				open={isEditUserOpen}
				onClose={() => setEditUserOpen(false)}
				user={selectedUser}
			/>

			<DeleteDialog
				isOpen={isDeleteUserOpen}
				onClose={() => {
					setDeleteUserOpen(false);
					setSelectedUser(null);
				}}
				onConfirm={handleConfirmDeleteUser}
				title="Delete User"
				description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
				confirmLabel="Delete User"
				confirmClassName="bg-red-600 hover:bg-red-700"
			/>
		</div>
	);
};

export default AccountsPage;
