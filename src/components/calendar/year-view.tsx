import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { useState } from "react";
import type { EventModel } from "@/models/event-model";
import { isSameMonth } from "@/utils/calendar-utils";
import { EventCard } from "./event-card";

interface YearViewProps {
	currentDate: Date;
	events: EventModel[];
	selectedDate: Date;
	onDateSelect: (date: Date) => void;
	onEventClick: (event: EventModel) => void;
	onEditEvent: (event: EventModel) => void;
	onDeleteEvent: (eventId: string) => void;
}

const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

type YearViewMode = "grid" | "list";

export const YearView = ({
	currentDate,
	events,
	selectedDate,
	onDateSelect,
	onEventClick,
	onEditEvent,
	onDeleteEvent,
}: YearViewProps) => {
	const [viewMode, setViewMode] = useState<YearViewMode>("grid");
	const year = currentDate.getFullYear();

	const getEventsForMonth = (monthIndex: number) => {
		return events.filter((event) => {
			const eventStart = new Date(event.startDate ?? 0);
			const eventEnd = new Date(event.endDate ?? 0);
			return (
				(eventStart.getFullYear() === year && eventStart.getMonth() === monthIndex) ||
				(eventEnd.getFullYear() === year && eventEnd.getMonth() === monthIndex) ||
				(eventStart.getFullYear() <= year &&
					eventEnd.getFullYear() >= year &&
					eventStart.getMonth() <= monthIndex &&
					eventEnd.getMonth() >= monthIndex)
			);
		});
	};

	const getEventsForYear = () => {
		return events
			.filter((event) => {
				const eventStart = new Date(event.startDate ?? 0);
				const eventEnd = new Date(event.endDate ?? 0);
				return eventStart.getFullYear() === year || eventEnd.getFullYear() === year;
			})
			.sort(
				(a, b) =>
					new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime(),
			);
	};

	const handleMonthClick = (monthIndex: number) => {
		const monthDate = new Date(year, monthIndex, 1);
		onDateSelect(monthDate);
	};

	const yearEvents = getEventsForYear();

	return (
		<div className="space-y-4">
			{/* View Toggle */}
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
					{year} Calendar {viewMode === "list" ? "- All Events" : "- Monthly Overview"}
				</h2>
				<div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
					<Button
						onClick={() => setViewMode("grid")}
						variant={viewMode === "grid" ? "default" : "ghost"}
						size="sm"
						className="h-8">
						<Grid className="h-4 w-4 mr-1" />
						Grid
					</Button>
					<Button
						onClick={() => setViewMode("list")}
						variant={viewMode === "list" ? "default" : "ghost"}
						size="sm"
						className="h-8">
						<List className="h-4 w-4 mr-1" />
						List
					</Button>
				</div>
			</div>

			{viewMode === "grid" ? (
				// Grid View (existing months display)
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
					{monthNames.map((monthName, monthIndex) => {
						const monthEvents = getEventsForMonth(monthIndex);
						const monthDate = new Date(year, monthIndex, 1);
						const isSelected = isSameMonth(selectedDate, monthDate);

						return (
							<div
								key={monthIndex}
								className={cn(
									"bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 transition-all duration-200 hover:shadow-md cursor-pointer",
									isSelected &&
										"ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-950",
								)}
								onClick={() => handleMonthClick(monthIndex)}>
								<div className="flex items-center justify-between mb-3">
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
										{monthName}
									</h3>
									<span className="text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
										{monthEvents.length} events
									</span>
								</div>

								<div className="space-y-2 max-h-48">
									{monthEvents.length === 0 ? (
										<p className="text-sm text-gray-400 dark:text-gray-500 italic">
											No events
										</p>
									) : (
										monthEvents.map((event) => (
											<EventCard
												key={event._id}
												event={event}
												onClick={onEventClick}
												onEdit={onEditEvent}
												onDelete={onDeleteEvent}
												isCompact={true}
												className="text-xs"
											/>
										))
									)}
								</div>
							</div>
						);
					})}
				</div>
			) : (
				// List View (new events list)
				<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
					{yearEvents.length === 0 ? (
						<div className="p-8 text-center">
							<p className="text-gray-500 dark:text-gray-400 text-lg">
								No events found for {year}
							</p>
						</div>
					) : (
						<div className="p-4">
							<div className="mb-4">
								<p className="text-sm text-gray-600 dark:text-gray-300">
									Showing {yearEvents.length} event
									{yearEvents.length !== 1 ? "s" : ""} for {year}
								</p>
							</div>
							<div className="space-y-3 overflow-y-auto max-h-[500px]">
								{yearEvents.map((event) => (
									<EventCard
										key={event._id}
										event={event}
										onClick={onEventClick}
										onEdit={onEditEvent}
										onDelete={onDeleteEvent}
										isCompact={false}
										showDetails={true}
										className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
									/>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
