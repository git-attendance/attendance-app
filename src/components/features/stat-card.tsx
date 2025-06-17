import { cn } from "@/lib/utils";
import { type ComponentType } from "react";

type StatCardProps = {
	title: string;
	value: number | string;
	icon: ComponentType<{ className?: string }>;
	changeType?: string;
	className?: string;
};

const StatCard = ({ title, value, icon: Icon, changeType, className = "" }: StatCardProps) => {
	const changeColor =
		changeType === "positive"
			? "text-green-600"
			: changeType === "negative"
				? "text-red-600"
				: "text-gray-600";

	return (
		<div className={cn("bg-gray-100 rounded-lg shadow p-6 dark:bg-gray-800", className)}>
			<div className="flex items-center justify-between mb-4">
				<div className="p-2 bg-blue-100 rounded-lg dark:bg-gray-700">
					<Icon className={`h-6 w-6 ${changeColor}`} />
				</div>
			</div>
			<h2 className="text-gray-600 text-sm font-medium">{title}</h2>
			<p className="text-2xl font-bold text-gray-800 mt-2 dark:text-white">{value}</p>
		</div>
	);
};

export default StatCard;
