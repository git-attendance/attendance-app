import StatCard from "@/components/features/stat-card";
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
		</div>
	);
};

export default Dashboard;
