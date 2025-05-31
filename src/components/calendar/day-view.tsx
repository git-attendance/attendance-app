import type { CalendarEvent } from "@/models/calendar";
import { formatDate, getEventsForDate } from "@/utils/calendar-utils";
import { EventCard } from "./event-card";

interface DayViewProps {
	currentDate: Date;
	events: CalendarEvent[];
	onEventClick: (event: CalendarEvent) => void;
}

export const DayView = ({ currentDate, events, onEventClick }: DayViewProps) => {
	const dayEvents = getEventsForDate(currentDate, events);
	const today = new Date();
	const isToday = currentDate.toDateString() === today.toDateString();

	const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

	return (
		<div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
			{/* Day header */}
			<div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{formatDate(currentDate)}
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
							{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""} scheduled
						</p>
					</div>
					{isToday && (
						<span className="bg-blue-800 text-white px-3 py-1 rounded-full text-sm font-medium">
							Today
						</span>
					)}
				</div>
			</div>

			<div className="flex">
				{/* Time column */}
				<div className="w-20 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
					{hours.map((hour) => (
						<div
							key={hour}
							className="h-16 p-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 flex items-start">
							{hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
						</div>
					))}
				</div>

				{/* Events column */}
				<div className="flex-1">
					{hours.map((_, hourIndex) => (
						<div
							key={hourIndex}
							className="h-16 p-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer relative">
							{/* Show events that fall in this hour range (simplified) */}
							{hourIndex < 4 && dayEvents.length > 0 && (
								<div className="space-y-2">
									{dayEvents
										.slice(hourIndex * 2, (hourIndex + 1) * 2)
										.map((event) => (
											<EventCard
												key={event.id}
												event={event}
												onClick={onEventClick}
												className="shadow-sm"
											/>
										))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Events summary at bottom */}
			{dayEvents.length > 0 && (
				<div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						All Events
					</h3>
					<div className="grid gap-3">
						{dayEvents.map((event) => (
							<EventCard
								key={event.id}
								event={event}
								onClick={onEventClick}
								className="p-4"
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
