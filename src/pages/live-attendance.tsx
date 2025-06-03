import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Play, Pause, Users, Clock } from "lucide-react";

import { useAttendance } from "@/contexts/attendance-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AttendanceCard from "@/components/features/attendance-card";

const LiveAttendance = () => {
	const navigate = useNavigate();
	const { state, markAttendance } = useAttendance();
	const [isLiveMode, setIsLiveMode] = useState(false);

	const today = useMemo(() => new Date().toDateString(), []);
	const allStudents = state.students;

	const todayAttendance = useMemo(
		() =>
			state.attendanceRecords.filter(
				(record) => new Date(record.timeIn).toDateString() === today,
			),
		[state.attendanceRecords, today],
	);

	const unattendedStudents = useMemo(
		() =>
			allStudents.filter(
				(student) => !todayAttendance.some((record) => record.studentId === student.id),
			),
		[allStudents, todayAttendance],
	);

	const displayedAttendance = useMemo(
		() =>
			todayAttendance
				.map((record) => {
					const student = allStudents.find((s) => s.id === record.studentId);
					return student
						? {
								student,
								attendance: record,
								displayTime: new Date(record.timeIn),
							}
						: null;
				})
				.filter(Boolean)
				.sort((a, b) => b!.displayTime.getTime() - a!.displayTime.getTime()) as Array<{
				student: (typeof allStudents)[number];
				attendance: (typeof todayAttendance)[number];
				displayTime: Date;
			}>,
		[todayAttendance, allStudents],
	);

	const attendanceRate =
		allStudents.length > 0
			? Math.round((todayAttendance.length / allStudents.length) * 100)
			: 0;

	const simulateAttendance = () => {
		if (unattendedStudents.length === 0) return;
		const randomStudent =
			unattendedStudents[Math.floor(Math.random() * unattendedStudents.length)];
		markAttendance(randomStudent.id);
	};

	useEffect(() => {
		if (!isLiveMode) return;

		const interval = setInterval(() => {
			if (Math.random() < 0.3) simulateAttendance();
		}, 5000);

		return () => clearInterval(interval);
	}, [isLiveMode, unattendedStudents]);

	const renderHeader = () => (
		<div className="flex justify-between items-start">
			<div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
					Live Attendance
				</h1>
				<p className="text-gray-600 mt-2 dark:text-gray-400">
					Real-time attendance tracking - {format(new Date(), "EEEE, MMMM d, yyyy")}
				</p>
			</div>
			<div className="flex items-center space-x-4">
				<Button
					onClick={() => setIsLiveMode((prev) => !prev)}
					variant={isLiveMode ? "destructive" : "default"}
					className="flex items-center gap-2">
					{isLiveMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
					{isLiveMode ? "Stop Live Mode" : "Start Live Mode"}
				</Button>
				<Button
					onClick={simulateAttendance}
					variant="outline"
					disabled={unattendedStudents.length === 0}>
					Simulate Attendance
				</Button>
			</div>
		</div>
	);

	const renderStatusBar = () => (
		<Card className="bg-gray-50 dark:bg-gray-800">
			<CardContent className="p-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-6">
						<div className="flex items-center space-x-2">
							<div
								className={`w-3 h-3 rounded-full ${
									isLiveMode ? "bg-green-500 animate-pulse" : "bg-gray-400"
								}`}
							/>
							<span className="font-medium">
								{isLiveMode ? "Live Monitoring Active" : "Live Monitoring Inactive"}
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<Users className="h-4 w-4 text-gray-500" />
							<span>
								{todayAttendance.length} of {allStudents.length} Present
							</span>
						</div>
						<div className="flex items-center space-x-2">
							<Clock className="h-4 w-4 text-gray-500" />
							<span>Updated: {format(new Date(), "h:mm:ss aa")}</span>
						</div>
					</div>
					<Badge
						variant={
							attendanceRate >= 80
								? "default"
								: attendanceRate >= 60
									? "secondary"
									: "destructive"
						}>
						{attendanceRate}% Attendance Rate
					</Badge>
				</div>
			</CardContent>
		</Card>
	);

	const renderAttendanceFeed = () => (
		<Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="h-5 w-5" />
					Today's Attendance ({todayAttendance.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				{displayedAttendance.length === 0 ? (
					<div className="text-center py-12">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-gray-700">
							<Users className="h-12 w-12 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">
							No Attendance Yet
						</h3>
						<p className="text-gray-600 mb-4 dark:text-gray-400">
							Students will appear here when they check in with face recognition
						</p>
						{isLiveMode && (
							<div className="flex justify-center">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
							</div>
						)}
					</div>
				) : (
					<div className="space-y-4">
						{displayedAttendance.map(({ student, attendance }) => (
							<AttendanceCard
								key={attendance.id}
								student={student}
								attendance={attendance}
								className="animate-fade-in"
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);

	const renderDemoPrompt = () =>
		allStudents.length === 0 && (
			<Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
				<CardContent className="p-6 text-center">
					<h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">
						Get Started
					</h3>
					<p className="text-gray-600 mb-4 dark:text-gray-400">
						Register students first to see live attendance tracking in action
					</p>
					<Button onClick={() => navigate("/admin/students/register")}>
						Register Your First Student
					</Button>
				</CardContent>
			</Card>
		);

	return (
		<div className="space-y-6">
			{renderHeader()}
			{renderStatusBar()}
			{renderAttendanceFeed()}
			{renderDemoPrompt()}
		</div>
	);
};

export default LiveAttendance;
