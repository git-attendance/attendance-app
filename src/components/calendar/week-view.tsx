import { cn } from "@/lib/utils";
import { getEventsForDate } from "@/utils/calendar-utils";
import { EventCard } from "./event-card";
import type { EventModel } from "@/models/event-model";

interface WeekViewProps {
	currentDate: Date;
	events: EventModel[];
	selectedDate?: Date;
	onDateSelect: (date: Date) => void;
	onEventClick: (event: EventModel) => void;
	onEditEvent?: (event: EventModel) => void;
	onDeleteEvent?: (eventId: string) => void;
}

const getWeekDays = (date: Date): Date[] => {
	const startOfWeek = new Date(date);
	const day = startOfWeek.getDay();
	startOfWeek.setDate(startOfWeek.getDate() - day);

	const weekDays: Date[] = [];
	for (let i = 0; i < 7; i++) {
		const weekDay = new Date(startOfWeek);
		weekDay.setDate(startOfWeek.getDate() + i);
		weekDays.push(weekDay);
	}

	return weekDays;
};

export const WeekView = ({
	currentDate,
	events,
	selectedDate,
	onDateSelect,
	onEventClick,
	onEditEvent,
	onDeleteEvent,
}: WeekViewProps) => {
	const weekDays = getWeekDays(currentDate);
	const today = new Date();
	const weekDayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

	return (
		<div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
			{/* Week header */}
			<div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
				<div className="p-4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
					<span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
						Time
					</span>
				</div>
				{weekDays.map((day, index) => {
					const isToday = day.toDateString() === today.toDateString();
					const isSelected =
						selectedDate && day.toDateString() === selectedDate.toDateString();

					return (
						<div
							key={index}
							className={cn(
								"p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-r border-gray-200 dark:border-gray-700 last:border-r-0",
								isSelected &&
									"bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500 ring-inset",
								isToday && "bg-blue-100 dark:bg-blue-800",
							)}
							onClick={() => onDateSelect(day)}>
							<div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
								{weekDayNames[index]}
							</div>
							<div
								className={cn(
									"text-lg font-bold mt-1",
									isToday &&
										"bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto",
								)}>
								{day.getDate()}
							</div>
						</div>
					);
				})}
			</div>

			{/* Week grid */}
			<div className="grid grid-cols-8 min-h-[600px]">
				{/* Time column */}
				<div className="border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
					{hours.map((hour) => (
						<div
							key={hour}
							className="h-20 p-2 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
							{hour}:00
						</div>
					))}
				</div>

				{/* Day columns */}
				{weekDays.map((day, dayIndex) => {
					const dayEvents = getEventsForDate(day, events);

					return (
						<div
							key={dayIndex}
							className="border-r border-gray-200 dark:border-gray-700 last:border-r-0">
							{hours.map((_, hourIndex) => (
								<div
									key={hourIndex}
									className="h-20 p-1 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
									onClick={() => onDateSelect(day)}>
									{/* Show events for this day (simplified - just show all events at the top) */}
									{hourIndex === 0 && dayEvents.length > 0 && (
										<div className="space-y-1">
											{dayEvents.slice(0, 2).map((event) => (
												<EventCard
													key={event._id}
													event={event}
													onClick={onEventClick}
													onEdit={onEditEvent}
													onDelete={onDeleteEvent}
													isCompact
													className="text-xs"
												/>
											))}
											{dayEvents.length > 2 && (
												<div className="text-xs text-gray-500 dark:text-gray-400 text-center">
													+{dayEvents.length - 2} more
												</div>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					);
				})}
			</div>
		</div>
	);
};
