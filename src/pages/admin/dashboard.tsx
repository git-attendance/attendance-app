import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { UserCheck, CheckCircle, XCircle, Clock, UserMinus, Users } from "lucide-react";
import StatCard from "@/components/features/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useAttendance } from "@/hooks/use-attendance";
import { useStudent } from "@/hooks/use-student";
import { formatDate } from "@/utils/common";

import type { AttendanceModel } from "@/models/attendance-model";

const Dashboard = () => {
	const { user } = useAuth();
	const [dateTime, setDateTime] = useState(new Date());
	const { getAll } = useStudent();
	const { getToday } = useAttendance();
	const { data: students = [] } = getAll();
	const { data: todaySummary } = getToday;

	useEffect(() => {
		const interval = setInterval(() => setDateTime(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	if (!user) return <p className="p-6">Loading...</p>;

	const title = user.role === "teacher" ? "Teacher Dashboard" : "Admin Dashboard";

	const todayAttendance: AttendanceModel[] = todaySummary?.records ?? [];
	const today = new Date().toDateString();

	const filteredTodayAttendance = useMemo(
		() =>
			todayAttendance.filter(
				(record) => new Date(record.checkInTime).toDateString() === today,
			),
		[todayAttendance, today],
	);

	const lateIn = useMemo(() => {
		const threshold = new Date();
		threshold.setHours(7, 30, 0, 0);
		return filteredTodayAttendance.filter((record) => {
			const checkIn = new Date(record.checkInTime);
			return checkIn > threshold && record.attendanceStatus === "present";
		}).length;
	}, [filteredTodayAttendance]);

	const excused = useMemo(() => {
		const excusedRemarks = [
			"excuse",
			"medical_appointment",
			"family_emergency",
			"official_business",
			"suspension",
		];
		return students.filter(
			(student) => student.remarks && excusedRemarks.includes(student.remarks),
		).length;
	}, [students]);

	const stats = [
		{
			title: "Total Students",
			value: students.length ?? 0,
			icon: Users,
			changeType: "neutral",
		},
		{
			title: "Present",
			value:
				todaySummary?.present ??
				todayAttendance.filter((r) => r.attendanceStatus === "present").length,
			icon: CheckCircle,
			changeType: "positive",
		},
		{
			title: "Late In",
			value: lateIn,
			icon: Clock,
			changeType: lateIn > 0 ? "negative" : "neutral",
		},
		{
			title: "Absent",
			value:
				todaySummary?.absent ??
				todayAttendance.filter((r) => r.attendanceStatus === "absent").length,
			icon: XCircle,
			changeType: (todaySummary?.absent ?? 0) > 0 ? "negative" : "neutral",
		},
		{
			title: "Excused",
			value: excused,
			icon: UserMinus,
			changeType: "neutral",
		},
	];

	return (
		<div className="p-2 space-y-6">
			{/* Header */}
			<div className="flex w-full justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
				<div className="flex flex-col items-end">
					<p className="font-medium text-gray-900 dark:text-white mt-4 md:mt-0">
						Today, {formatDate(dateTime)}
					</p>
					<p className="text-sm text-gray-900 dark:text-white mt-4 md:mt-0">
						{dateTime.toLocaleTimeString("en-US", {
							hour: "numeric",
							minute: "2-digit",
						})}
					</p>
				</div>
			</div>

			{/* Stat Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
				{stats.map((stat, index) => (
					<StatCard
						key={index}
						title={stat.title}
						value={stat.value}
						icon={stat.icon}
						changeType={stat.changeType}
					/>
				))}
			</div>

			{/* Recent Attendance Activity */}
			<Card className="dark:bg-gray-800 bg-white shadow-sm">
				<CardHeader>
					<CardTitle>Recent Attendance Activity</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredTodayAttendance.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No attendance records for today yet.</p>
							<p className="text-sm">Students will appear here when they check in.</p>
						</div>
					) : (
						<div className="space-y-3">
							{filteredTodayAttendance
								.sort(
									(a, b) =>
										new Date(b.checkInTime).getTime() -
										new Date(a.checkInTime).getTime(),
								)
								.slice(0, 5)
								.map((record) => {
									const student = students.find(
										(s) => s._id === record.studentId,
									);
									if (!student) return null;

									const initials = `${student.firstName[0] ?? ""}${student.lastName[0] ?? ""}`;

									return (
										<div
											key={`${record.studentId}-${record.checkInTime}`}
											className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
													<span className="text-blue-600 dark:text-blue-300 font-semibold">
														{initials}
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900 dark:text-white">
														{student.firstName} {student.lastName}
													</p>
													<p className="text-sm text-gray-500 dark:text-gray-300">
														{student.section}{" "}
														{student.strand
															? `- ${student.strand}`
															: ""}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900 dark:text-white">
													{format(
														new Date(record.checkInTime),
														"h:mm aa",
													)}
												</p>
												<p className="text-xs text-green-600 dark:text-green-400">
													Present
												</p>
											</div>
										</div>
									);
								})}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Dashboard;
