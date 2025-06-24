import { cn } from "@/lib/utils";
import { Clock, Edit, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import type { EventModel } from "@/models/event-model";
import { formatDate } from "@/utils/calendar-utils";
import { formatTimeFromDate } from "@/utils/common";

interface EventCardProps {
	event: EventModel;
	onClick?: (event: EventModel) => void;
	onEdit?: (event: EventModel) => void;
	onDelete?: (eventId: string) => void;
	className?: string;
	isCompact?: boolean;
	showDetails?: boolean;
}

export const EventCard = ({
	event,
	onClick,
	onEdit,
	onDelete,
	className,
	isCompact = false,
	showDetails = false,
}: EventCardProps) => {
	const { user } = useAuth();
	const isAdmin = user?.role === "admin";
	const handleClick = () => {
		if (onClick) {
			onClick(event);
		}
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(event);
		}
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onDelete) {
			onDelete(event._id);
		}
	};

	const isEventOwner = user?.role === "teacher" && user._id === event.organizerId;
	const showActions = (isAdmin || isEventOwner) && (onEdit || onDelete);

	const startDate = new Date(event.startDate ?? 0);
	const endDate = new Date(event.endDate ?? 0);
	const isSameDay = startDate.toDateString() === endDate.toDateString();

	if (showDetails) {
		return (
			<div
				className={cn(
					"bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 transition-all duration-200 hover:shadow-md relative group",
					onClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
					className,
				)}
				onClick={onClick ? handleClick : undefined}>
				<div className="p-2">
					<div className="flex items-start justify-between">
						<div className="flex-1 ">
							<div className="flex items-start gap-3">
								{/* <div
									className={cn(
										"w-4 h-4 rounded-full mt-1 flex-shrink-0",
										event.bgColor,
									)}
								/> */}
								<div className="flex-1 min-w-0">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
										{event.name}
									</h3>
									{event.description && (
										<p className="text-gray-600 dark:text-gray-300 mb-3 text-sm leading-relaxed">
											{event.description}
										</p>
									)}

									<div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
										<div className="flex items-center gap-1">
											<Clock className="h-4 w-4" />
											<span>
												{isSameDay
													? `${formatDate(startDate)} • ${formatTimeFromDate(startDate)} - ${formatTimeFromDate(endDate)}`
													: `${formatDate(startDate)} ${formatTimeFromDate(startDate)} - ${formatDate(endDate)} ${formatTimeFromDate(endDate)}`}
											</span>
										</div>

										{event.location && (
											<div className="flex items-center gap-1">
												<MapPin className="h-4 w-4" />
												<span>{event.location}</span>
											</div>
										)}

										<div className="flex items-center gap-1">
											<div
												className={cn(
													"w-2 h-2 rounded-full",
													event.bgColor,
												)}
											/>
											<span>{event.name}</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{showActions && (
							<div className="flex gap-1 ml-4">
								{onEdit && (
									<Button
										size="sm"
										variant="outline"
										className="h-8 w-8 p-0 dark:bg-gray-800 dark:border-gray-700"
										onClick={handleEdit}
										title="Edit event">
										<Edit className="h-3 w-3 dark:text-white" />
									</Button>
								)}
								{onDelete && (
									<Button
										size="sm"
										variant="outline"
										className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900 dark:hover:border-red-700 dark:bg-gray-800 dark:border-gray-700"
										onClick={handleDelete}
										title="Delete event">
										<Trash2 className="h-3 w-3 text-red-500 dark:text-red-400" />
									</Button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
	return (
		<div
			className={cn(
				"rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm relative group",
				event.bgColor,
				event.color,
				isCompact ? "truncate" : "mb-1",
				onClick && "cursor-pointer hover:scale-105",
				className,
			)}
			onClick={onClick ? handleClick : undefined}
			title={event.name}>
			{isCompact ? (
				<div className="truncate dark:text-black">{event.name}</div>
			) : (
				<div>
					<div className="font-semibold pr-12 dark:text-black">{event.name}</div>
					{event.description && (
						<div className="text-xs opacity-80 mt-1 dark:text-gray-800">
							{event.description}
						</div>
					)}
				</div>
			)}

			{showActions && !isCompact && (
				<div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
					{onEdit && (
						<Button
							size="sm"
							variant="ghost"
							className="h-6 w-6 p-0 hover:bg-white/20"
							onClick={handleEdit}
							title="Edit event">
							<Edit className="h-3 w-3 dark:text-black" />
						</Button>
					)}
					{onDelete && (
						<Button
							size="sm"
							variant="ghost"
							className="h-6 w-6 p-0 hover:bg-red-500/20"
							onClick={handleDelete}
							title="Delete event">
							<Trash2 className="h-3 w-3 dark:text-black" />
						</Button>
					)}
				</div>
			)}
		</div>
	);
};
