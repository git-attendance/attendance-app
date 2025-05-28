import { Users, Calendar, BookOpen, BarChart3 } from "lucide-react";

export const dashboardData = {
	admin: {
		title: "Admin Dashboard",
		stats: [
			{
				title: "Total Students",
				value: "1,234",
				icon: Users,
				change: "+12%",
				changeType: "positive",
			},
			{
				title: "Attendance Rate",
				value: "95.8%",
				icon: Calendar,
				change: "+2.3%",
				changeType: "positive",
			},
			{
				title: "Active Subjects",
				value: "24",
				icon: BookOpen,
				change: "No change",
				changeType: "neutral",
			},
			{
				title: "Performance",
				value: "88.5%",
				icon: BarChart3,
				change: "+5.2%",
				changeType: "positive",
			},
		],
	},
	teacher: {
		title: "Teacher Dashboard",
		stats: [
			{
				title: "My Students",
				value: "243",
				icon: Users,
				change: "+5%",
				changeType: "positive",
			},
			{
				title: "My Attendance Rate",
				value: "98.2%",
				icon: Calendar,
				change: "+1.5%",
				changeType: "positive",
			},
			{
				title: "Subjects Taught",
				value: "5",
				icon: BookOpen,
				change: "+1",
				changeType: "positive",
			},
			{
				title: "Avg Grades",
				value: "92%",
				icon: BarChart3,
				change: "+3%",
				changeType: "positive",
			},
		],
	},
};
