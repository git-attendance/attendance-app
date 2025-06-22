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
import { Users, CreditCard, Shield, GraduationCap } from "lucide-react";
import { format } from "date-fns";
import { useUsers } from "@/hooks/use-user";
import { useStudent } from "@/hooks/use-student";
import type { UserModel } from "@/models/user-model";
import type { StudentModel } from "@/models/student-model";

const AccountsPage = () => {
	const { data: users = [] } = useUsers();
	const { getAll: getAllStudents } = useStudent();
	const students = getAllStudents().data ?? [];

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

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold ">Accounts</h1>
				<p className="text-gray-600 dark:text-gray-200 mt-2">
					Manage all user accounts and students in the system
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<Card className="dark:bg-gray-800 bg-gray-100">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-200">
									Total Accounts
								</p>
								<p className="text-2xl font-bold ">{totalAccounts}</p>
							</div>
							<div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
								<Users className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="dark:bg-gray-800 bg-gray-100">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-200">
									Admin Users
								</p>
								<p className="text-2xl font-bold ">{adminCount}</p>
							</div>
							<div className="p-3 rounded-lg bg-red-50 dark:bg-blue-900/10">
								<Shield className="h-6 w-6 text-red-600" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="dark:bg-gray-800 bg-gray-100">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-200">
									Teachers
								</p>
								<p className="text-2xl font-bold ">{teacherCount}</p>
							</div>
							<div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
								<CreditCard className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="dark:bg-gray-800 bg-gray-100">
					<CardContent className="p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600 dark:text-gray-200">
									Students
								</p>
								<p className="text-2xl font-bold ">{totalStudents}</p>
							</div>
							<div className="p-3 rounded-lg bg-green-50 dark:bg-blue-900/10">
								<GraduationCap className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="users" className="space-y-6">
				<TabsList>
					<TabsTrigger value="users">System Users</TabsTrigger>
					<TabsTrigger value="students">Students</TabsTrigger>
				</TabsList>

				{/* USERS TABLE */}
				<TabsContent value="users">
					<Card className="dark:bg-gray-800 bg-gray-100">
						<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<CardTitle>System Users</CardTitle>
							<div className="flex gap-4 w-full md:w-auto flex-col md:flex-row">
								<Input
									placeholder="Search name or email..."
									value={userSearch}
									onChange={(e) => setUserSearch(e.target.value)}
								/>
								<Select onValueChange={setSelectedRole} value={selectedRole}>
									<SelectTrigger className="w-full md:w-[180px]">
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
						<CardContent>
							{filteredUsers.length === 0 ? (
								<div className="text-center py-8 text-gray-50 dark:bg-blue-900/10">
									<Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
									<p>No users found.</p>
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>Email</TableHead>
											<TableHead>User ID</TableHead>
											<TableHead>Created</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredUsers.map((user: any) => (
											<TableRow key={user._id}>
												<TableCell className="font-medium">
													{user.name}
												</TableCell>
												<TableCell>
													<Badge className={getRoleColor(user.role)}>
														{user.role.charAt(0).toUpperCase() +
															user.role.slice(1)}
													</Badge>
												</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell>{user._id.slice(-8)}</TableCell>
												<TableCell>
													{format(
														new Date(user.createdAt),
														"MMM d, yyyy",
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* STUDENTS TABLE */}
				<TabsContent value="students">
					<Card className="dark:bg-gray-800 bg-gray-100">
						<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<CardTitle>Students</CardTitle>
							<div className="flex gap-4 w-full md:w-auto flex-col md:flex-row">
								<Input
									placeholder="Search name or email..."
									value={studentSearch}
									onChange={(e) => setStudentSearch(e.target.value)}
								/>
								<Select onValueChange={setSelectedStrand} value={selectedStrand}>
									<SelectTrigger className="w-full md:w-[180px]">
										<SelectValue placeholder="Filter by strand" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Strands</SelectItem>
										<SelectItem value="STEM">STEM</SelectItem>
										<SelectItem value="ABM">ABM</SelectItem>
										<SelectItem value="HUMSS">HUMSS</SelectItem>
										<SelectItem value="GAS">GAS</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent>
							{filteredStudents.length === 0 ? (
								<div className="text-center py-8 text-gray-50 dark:bg-blue-900/10">
									<GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
									<p>No students found.</p>
								</div>
							) : (
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
										{filteredStudents.map((student) => (
											<TableRow key={student._id}>
												<TableCell className="font-medium">
													{student.firstName} {student.middleName}{" "}
													{student.lastName}
												</TableCell>
												<TableCell>{student.email}</TableCell>
												<TableCell>{student.studentId}</TableCell>
												<TableCell>
													{student.gradeLevel} - {student.section}
												</TableCell>
												<TableCell>
													<Badge
														className={getStrandColor(student.strand)}>
														{student.strand ? student.strand : "N/A"}
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
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default AccountsPage;
