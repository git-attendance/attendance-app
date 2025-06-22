import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import type { EventModel } from "@/models/event-model";

interface EventCardProps {
	event: EventModel;
	onClick?: (event: EventModel) => void;
	onEdit?: (event: EventModel) => void;
	onDelete?: (eventId: string) => void;
	className?: string;
	isCompact?: boolean;
}

export const EventCard = ({
	event,
	onClick,
	onEdit,
	onDelete,
	className,
	isCompact = false,
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

	const showActions = isAdmin && (onEdit || onDelete);

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
