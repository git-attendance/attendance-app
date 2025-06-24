import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp, UserCheck, UserX } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { useStudent } from "@/hooks/use-student";
import { useAttendance } from "@/hooks/use-attendance";

const AttendanceReports = () => {
	const { getAll: getStudents } = useStudent();
	const { getToday } = useAttendance();

	const { data: students = [] } = getStudents();
	const { data: todayData } = getToday;
	const attendanceRecords = todayData?.records || [];

	const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly" | "yearly">(
		"weekly",
	);
	const [chartType, setChartType] = useState<"bar" | "line">("bar");

	const todayDataChart = useMemo(() => {
		const today = new Date();
		return [
			{
				day: format(today, "MMM dd"),
				present: attendanceRecords.length,
				absent: students.length - attendanceRecords.length,
				total: students.length,
			},
		];
	}, [attendanceRecords, students]);

	const weeklyData = useMemo(() => {
		const today = new Date();
		const weekStart = startOfWeek(today, { weekStartsOn: 1 });
		const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
		const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
		return daysInWeek.map((day) => {
			const dayAttendance = attendanceRecords.filter(
				(record) => new Date(record.checkInTime).toDateString() === day.toDateString(),
			);
			return {
				day: format(day, "EEE"),
				date: format(day, "MMM dd"),
				present: dayAttendance.length,
				absent: students.length - dayAttendance.length,
				total: students.length,
			};
		});
	}, [attendanceRecords, students]);

	const monthlyData = useMemo(() => {
		const currentDate = new Date();
		const daysInMonth = eachDayOfInterval({
			start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
			end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
		});
		return daysInMonth.map((day) => {
			const dayAttendance = attendanceRecords.filter(
				(record) => new Date(record.checkInTime).toDateString() === day.toDateString(),
			);
			return {
				day: format(day, "MMM dd"),
				present: dayAttendance.length,
				absent: students.length - dayAttendance.length,
				total: students.length,
			};
		});
	}, [attendanceRecords, students]);

	const yearlyData = useMemo(() => {
		const currentYear = new Date().getFullYear();
		const months = Array.from({ length: 12 }, (_, i) => new Date(currentYear, i, 1));
		return months.map((monthDate) => {
			const month = monthDate.getMonth();
			const year = monthDate.getFullYear();
			const monthlyRecords = attendanceRecords.filter((record) => {
				const time = new Date(record.checkInTime);
				return time.getFullYear() === year && time.getMonth() === month;
			});
			return {
				day: format(monthDate, "MMM"),
				present: monthlyRecords.length,
				absent: students.length * 20 - monthlyRecords.length,
				total: students.length,
			};
		});
	}, [attendanceRecords, students]);

	const chartData = useMemo(() => {
		switch (reportType) {
			case "daily":
				return todayDataChart;
			case "weekly":
				return weeklyData;
			case "monthly":
				return monthlyData;
			case "yearly":
				return yearlyData;
			default:
				return todayDataChart;
		}
	}, [reportType, todayDataChart, weeklyData, monthlyData, yearlyData]);

	const chartConfig = {
		present: { label: "Present", color: "#10B981" },
		absent: { label: "Absent", color: "#EF4444" },
	};

	return (
		<div className="p-6 space-y-6  min-h-screen">
			<div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Attendance Reports
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						Visual reports of student attendance patterns
					</p>
				</div>

				<div className="flex gap-4">
					<Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
						<SelectTrigger className="w-[150px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="dark:bg-gray-800 dark:text-gray-100">
							<SelectItem value="daily">Today</SelectItem>
							<SelectItem value="weekly">This Week</SelectItem>
							<SelectItem value="monthly">This Month</SelectItem>
							<SelectItem value="yearly">This Year</SelectItem>
						</SelectContent>
					</Select>

					<Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
						<SelectTrigger className="w-[150px] dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="dark:bg-gray-800 dark:text-gray-100">
							<SelectItem value="bar">Bar Chart</SelectItem>
							<SelectItem value="line">Line Chart</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
							Total Students
						</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{students.length}
						</div>
						<p className="text-xs text-muted-foreground dark:text-gray-400">
							Registered students
						</p>
					</CardContent>
				</Card>

				<Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
							Avg Present
						</CardTitle>
						<UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-green-600 dark:text-green-400">
							{Math.round(
								chartData.reduce((sum, day) => sum + day.present, 0) /
									chartData.length,
							)}
						</div>
						<p className="text-xs text-muted-foreground dark:text-gray-400">
							Average per entry
						</p>
					</CardContent>
				</Card>

				<Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
							Avg Absent
						</CardTitle>
						<UserX className="h-4 w-4 text-red-600 dark:text-red-400" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-red-600 dark:text-red-400">
							{Math.round(
								chartData.reduce((sum, day) => sum + day.absent, 0) /
									chartData.length,
							)}
						</div>
						<p className="text-xs text-muted-foreground dark:text-gray-400">
							Average per entry
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Chart */}
			<Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
				<CardHeader>
					<CardTitle className="text-gray-900 dark:text-gray-100">
						{reportType === "daily"
							? "Today"
							: reportType === "weekly"
								? "This Week"
								: reportType === "monthly"
									? "This Month"
									: "This Year"}{" "}
						Attendance {chartType === "bar" ? "Bar" : "Line"} Chart
					</CardTitle>
					<CardDescription className="dark:text-gray-400">
						Breakdown of present and absent students
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="h-[400px]">
						<ResponsiveContainer width="100%" height="100%">
							{chartType === "bar" ? (
								<BarChart data={chartData}>
									<XAxis
										dataKey="day"
										stroke="#8884d8"
										tick={{ fill: "#374151" }}
									/>
									<YAxis stroke="#8884d8" tick={{ fill: "#374151" }} />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar dataKey="present" fill="#10B981" name="Present" />
									<Bar dataKey="absent" fill="#EF4444" name="Absent" />
								</BarChart>
							) : (
								<LineChart data={chartData}>
									<XAxis
										dataKey="day"
										stroke="#8884d8"
										tick={{ fill: "#374151" }}
									/>
									<YAxis stroke="#8884d8" tick={{ fill: "#374151" }} />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Line
										type="monotone"
										dataKey="present"
										stroke="#10B981"
										strokeWidth={3}
										name="Present"
									/>
									<Line
										type="monotone"
										dataKey="absent"
										stroke="#EF4444"
										strokeWidth={3}
										name="Absent"
									/>
								</LineChart>
							)}
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
};

export default AttendanceReports;
