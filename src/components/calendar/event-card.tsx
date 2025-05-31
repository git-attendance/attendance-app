import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/models/calendar";

interface EventCardProps {
	event: CalendarEvent;
	onClick?: (event: CalendarEvent) => void;
	className?: string;
	isCompact?: boolean;
}

export const EventCard = ({ event, onClick, className, isCompact = false }: EventCardProps) => {
	const handleClick = () => {
		if (onClick) {
			onClick(event);
		}
	};

	return (
		<div
			className={cn(
				"rounded-md px-2 py-1 text-xs font-medium cursor-pointer transition-all duration-200 hover:shadow-sm",
				event.type.bgColor,
				event.type.color,
				isCompact ? "truncate" : "mb-1",
				className,
			)}
			onClick={handleClick}
			title={event.title}>
			{isCompact ? (
				<div className="truncate">{event.title}</div>
			) : (
				<div>
					<div className="font-semibold">{event.title}</div>
					{event.description && (
						<div className="text-xs opacity-80 mt-1">{event.description}</div>
					)}
				</div>
			)}
		</div>
	);
};
