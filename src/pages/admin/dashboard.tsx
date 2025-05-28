import { dashboardData } from "@/configs/test/dashboard-data";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/utils/common";
import { useEffect, useState } from "react";

const Dashboard = () => {
	const { user } = useAuth();
	const [dateTime, setDateTime] = useState(new Date());

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
		<div className="p-2">
			<div className="flex w-full justify-end">
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
			<h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">{title}</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{stats.map((stat, index) => {
					const Icon = stat.icon;
					return (
						<div
							key={index}
							className="bg-gray-100 rounded-lg shadow p-6 dark:bg-gray-800">
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

export default Dashboard;
