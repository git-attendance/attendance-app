import type { CalendarEvent, CalendarView } from "@/models/calendar";
import { getEventsForDate } from "@/utils/calendar-utils";
import { useEffect, useState } from "react";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import { EventsSidebar } from "./events-sidebar";
import { eventTypes, sampleEvents } from "@/configs/test/sample-events";
import { toast } from "sonner";
import { eventStorageService } from "@/services/eventLocalService";
import { CreateEventModal } from "./create-event-form";

export const CalendarTemplate = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [view, setView] = useState<CalendarView>("month");
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

	// Load events from localStorage on component mount
	useEffect(() => {
		const storedEvents = eventStorageService.getEvents();
		if (storedEvents.length > 0) {
			setEvents(storedEvents);
		} else {
			// If no stored events, use sample events and save them
			setEvents(sampleEvents);
			eventStorageService.saveEvents(sampleEvents);
		}
	}, []);

	const handlePrevious = () => {
		const newDate = new Date(currentDate);
		if (view === "month") {
			newDate.setMonth(newDate.getMonth() - 1);
		} else if (view === "week") {
			newDate.setDate(newDate.getDate() - 7);
		} else {
			newDate.setDate(newDate.getDate() - 1);
		}
		setCurrentDate(newDate);
	};

	const handleNext = () => {
		const newDate = new Date(currentDate);
		if (view === "month") {
			newDate.setMonth(newDate.getMonth() + 1);
		} else if (view === "week") {
			newDate.setDate(newDate.getDate() + 7);
		} else {
			newDate.setDate(newDate.getDate() + 1);
		}
		setCurrentDate(newDate);
	};

	const handleToday = () => {
		const today = new Date();
		setCurrentDate(today);
		setSelectedDate(today);
	};

	const handleDateSelect = (date: Date) => {
		setSelectedDate(date);
	};

	const handleEventClick = (event: CalendarEvent) => {
		toast.message(event.title, {
			description: event.description || `Event on ${event.startDate.toLocaleDateString()}`,
		});
	};

	const handleCreateEvent = (newEventData: Omit<CalendarEvent, "id">) => {
		const newEvent: CalendarEvent = {
			...newEventData,
			id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
		};

		// Add to localStorage
		eventStorageService.addEvent(newEvent);

		// Update local state
		setEvents((prevEvents) => [...prevEvents, newEvent]);

		toast.message(newEvent.title, {
			description: `"${newEvent.title}" has been added to your calendar.`,
		});
	};

	const handleDeleteEvent = (eventId: string) => {
		// 1. Remove from localStorage
		eventStorageService.removeEvent(eventId);

		// 2. Update local state
		setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));

		toast.success("Event deleted");
	};

	const selectedDateEvents = getEventsForDate(selectedDate, events);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
			<CalendarHeader
				currentDate={currentDate}
				view={view}
				onPrevious={handlePrevious}
				onNext={handleNext}
				onViewChange={setView}
				onToday={handleToday}
				onCreateEventClick={() => setIsCreateModalOpen(true)}
			/>

			<div className="flex">
				<div className="flex-1 p-6 bg-white dark:bg-gray-900 rounded-lg shadow transition-colors">
					{view === "month" && (
						<MonthView
							currentDate={currentDate}
							events={events}
							selectedDate={selectedDate}
							onDateSelect={handleDateSelect}
							onEventClick={handleEventClick}
						/>
					)}
					{view === "week" && (
						<WeekView
							currentDate={currentDate}
							events={events}
							selectedDate={selectedDate}
							onDateSelect={handleDateSelect}
							onEventClick={handleEventClick}
						/>
					)}
					{view === "day" && (
						<DayView
							currentDate={currentDate}
							events={events}
							onEventClick={handleEventClick}
						/>
					)}
				</div>

				<EventsSidebar
					selectedDate={selectedDate}
					events={selectedDateEvents}
					eventTypes={eventTypes}
					onEventClick={handleEventClick}
					onEventDelete={handleDeleteEvent}
				/>
			</div>
			{/* Create Event Modal */}
			<CreateEventModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onCreateEvent={handleCreateEvent}
				eventTypes={eventTypes}
				initialDate={selectedDate}
			/>
		</div>
	);
};
