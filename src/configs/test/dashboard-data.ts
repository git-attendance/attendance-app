import { Users, UserCheck, Clock, UserX, UserMinus } from "lucide-react";

export const dashboardData = {
	admin: {
		title: "Admin Dashboard",
		stats: [
			{
				title: "Total Students",
				value: 120,
				change: "+5",
				changeType: "positive",
				icon: Users,
			},
			{
				title: "Present",
				value: 100,
				change: "+2",
				changeType: "positive",
				icon: UserCheck,
			},
			{
				title: "Late In",
				value: 8,
				change: "-1",
				changeType: "negative",
				icon: Clock,
			},
			{
				title: "Absent",
				value: 10,
				change: "+1",
				changeType: "negative",
				icon: UserX,
			},
			{
				title: "Excused",
				value: 2,
				change: "0",
				changeType: "neutral",
				icon: UserMinus,
			},
		],
	},

	teacher: {
		title: "Teacher Dashboard",
		stats: [
			{
				title: "Total Students",
				value: 30,
				change: "+1",
				changeType: "positive",
				icon: Users,
			},
			{
				title: "Present",
				value: 25,
				change: "+1",
				changeType: "positive",
				icon: UserCheck,
			},
			{
				title: "Late In",
				value: 2,
				change: "-1",
				changeType: "negative",
				icon: Clock,
			},
			{
				title: "Absent",
				value: 2,
				change: "+1",
				changeType: "negative",
				icon: UserX,
			},
			{
				title: "Excused",
				value: 1,
				change: "0",
				changeType: "neutral",
				icon: UserMinus,
			},
		],
	},
};
