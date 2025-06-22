import { cn } from "@/lib/utils";
import { getDaysInMonth, getEventsForDate, isSameDay, isSameMonth } from "@/utils/calendar-utils";
import { EventCard } from "./event-card";
import type { EventModel } from "@/models/event-model";

interface MonthViewProps {
	currentDate: Date;
	events: EventModel[];
	selectedDate?: Date;
	onDateSelect: (date: Date) => void;
	onEventClick: (event: EventModel) => void;
	onEditEvent?: (event: EventModel) => void;
	onDeleteEvent?: (eventId: string) => void;
}

export const MonthView = ({
	currentDate,
	events,
	selectedDate,
	onDateSelect,
	onEventClick,
	onEditEvent,
	onDeleteEvent,
}: MonthViewProps) => {
	const days = getDaysInMonth(currentDate);
	const today = new Date();

	const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return (
		<div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
			{/* Week day headers */}
			<div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
				{weekDays.map((day) => (
					<div
						key={day}
						className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 dark:text-gray-200 dark:bg-gray-800">
						{day}
					</div>
				))}
			</div>

			{/* Calendar grid */}
			<div className="grid grid-cols-7">
				{days.map((day, index) => {
					const dayEvents = getEventsForDate(day, events);
					const isCurrentMonth = isSameMonth(day, currentDate);
					const isToday = isSameDay(day, today);
					const isSelected = selectedDate && isSameDay(day, selectedDate);

					return (
						<div
							key={index}
							className={cn(
								"min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
								!isCurrentMonth &&
									"bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
								isSelected &&
									"bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500 ring-inset",
							)}
							onClick={() => onDateSelect(day)}>
							<div className="flex items-center justify-between mb-2">
								<span
									className={cn(
										"text-sm font-medium",
										isToday &&
											"bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs",
										!isCurrentMonth && "text-gray-400 dark:text-gray-500",
									)}>
									{day.getDate()}
								</span>
							</div>

							<div className="space-y-1 max-h-[80px] ">
								{dayEvents.slice(0, 3).map((event) => (
									<EventCard
										key={event._id}
										event={event}
										onClick={onEventClick}
										onEdit={onEditEvent}
										onDelete={onDeleteEvent}
										isCompact
									/>
								))}
								{dayEvents.length > 3 && (
									<div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
										+{dayEvents.length - 3} more
									</div>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
