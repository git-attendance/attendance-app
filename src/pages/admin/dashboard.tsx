import { BarChart3, Users, Calendar, BookOpen } from "lucide-react";

const AdminDashboard = () => {
	const stats = [
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
	];

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">
				Admin Dashboard
			</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div
							key={index}
							className="bg-gray-100 rounded-lg shadow p-6 dark:bg-gray-800 ">
							<div className="flex items-center justify-between mb-4">
								<div className="p-2 bg-blue-100 rounded-lg dark:bg-gray-700">
									<Icon className="h-6 w-6 text-blue-600" />
								</div>
								<span
									className={`text-sm font-medium ${
										stat.changeType === "positive"
											? "text-green-600"
											: stat.changeType === "negative"
												? "text-red-600"
												: "text-gray-600"
									}`}>
									{stat.change}
								</span>
							</div>
							<h2 className="text-gray-600 text-sm font-medium">{stat.title}</h2>
							<p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AdminDashboard;
