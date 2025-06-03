import StatCard from "@/components/features/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardData } from "@/configs/test/dashboard-data";
import { useAttendance } from "@/contexts/attendance-context";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/utils/common";
import { UserCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [dateTime, setDateTime] = useState(new Date());
	const { state } = useAttendance();

	const today = new Date().toDateString();
	const todayAttendance = state.attendanceRecords.filter(
		(record) => new Date(record.timeIn).toDateString() === today,
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setDateTime(new Date());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	if (!user) return <p className="p-6">Loading...</p>;

	const role = user.role === "teacher" ? "teacher" : "admin";
	const { title, stats } = dashboardData[role];

	return (
		<div className="p-2 space-y-6">
			<div className="flex w-full justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
				<div className="flex flex-col items-end ">
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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
				{stats.map((stat, index) => (
					<StatCard
						key={index}
						title={stat.title}
						value={stat.value}
						icon={stat.icon}
						change={stat.change}
						changeType={stat.changeType}
					/>
				))}
			</div>
			{/* Recent Activity */}
			<Card className="dark:bg-gray-800 bg-white shadow-sm">
				<CardHeader>
					<CardTitle>Recent Attendance Activity</CardTitle>
				</CardHeader>
				<CardContent>
					{todayAttendance.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No attendance records for today yet.</p>
							<p className="text-sm">Students will appear here when they check in.</p>
						</div>
					) : (
						<div className="space-y-3">
							{todayAttendance
								.sort(
									(a, b) =>
										new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime(),
								)
								.slice(0, 5)
								.map((record) => {
									const student = state.students.find(
										(s) => s.id === record.studentId,
									);
									if (!student) return null;

									return (
										<div
											key={record.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
													<span className="text-blue-600 font-semibold">
														{student.fullName
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">
														{student.fullName}
													</p>
													<p className="text-sm text-gray-500">
														{student.section} - {student.strand}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900">
													{formatDate(new Date(record.timeIn), "h:mm aa")}
												</p>
												<p className="text-xs text-green-600">Present</p>
											</div>
										</div>
									);
								})}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
				<Card
					className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800 "
					onClick={() => navigate("/admin/live-attendance")}>
					<CardContent className="p-6 text-center">
						<UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">
							Live Attendance
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							View real-time attendance as students check in
						</p>
					</CardContent>
				</Card>

				<Card className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800">
					<CardContent className="p-6 text-center">
						<Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">
							Register Student
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Add new students with face recognition setup
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Dashboard;
