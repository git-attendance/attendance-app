import { eventTypes, sampleEvents } from "@/configs/test/sample-events";
import type { CalendarEvent, CalendarView } from "@/models/calendar";
import { eventStorageService } from "@/services/eventLocalService";
import { getEventsForDate } from "@/utils/calendar-utils";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CalendarHeader } from "./calendar-header";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import { EventsSidebar } from "./events-sidebar";
import { CreateEventModal } from "./create-event-form";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";

export const CalendarTemplate = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [view, setView] = useState<CalendarView>("month");
	const [events, setEvents] = useState<CalendarEvent[]>([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
	const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

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
		toast.info(
			`${event.title}
			${event.description}` || `Event on ${event.startDate.toLocaleDateString()}`,
		);
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

		toast.info(`"${newEvent.title}" has been added to your calendar.`);
	};

	const handleUpdateEvent = (updatedEventData: Omit<CalendarEvent, "id">) => {
		if (!editingEvent) return;

		const updatedEvent: CalendarEvent = {
			...updatedEventData,
			id: editingEvent.id,
		};

		// Update in localStorage
		eventStorageService.updateEvent(updatedEvent);

		// Update local state
		setEvents((prevEvents) =>
			prevEvents.map((event) => (event.id === editingEvent.id ? updatedEvent : event)),
		);

		toast.info(`"${updatedEvent.title}" has been updated in your calendar.`);

		setEditingEvent(null);
	};

	const handleDeleteEvent = (eventId: string) => {
		const event = events.find((e) => e.id === eventId);
		if (event) {
			setEventToDelete(event);
		}
	};

	const confirmDeleteEvent = () => {
		if (!eventToDelete) return;

		// Remove from localStorage
		eventStorageService.removeEvent(eventToDelete.id);

		// Update local state
		setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete.id));

		toast(`"${eventToDelete.title}" has been deleted from your calendar.`);

		setEventToDelete(null);
	};

	const handleEditEvent = (event: CalendarEvent) => {
		setEditingEvent(event);
		setIsCreateModalOpen(true);
	};

	const selectedDateEvents = getEventsForDate(selectedDate, events);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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
				<div className="flex-1 p-6">
					{view === "month" && (
						<MonthView
							currentDate={currentDate}
							events={events}
							selectedDate={selectedDate}
							onDateSelect={handleDateSelect}
							onEventClick={handleEventClick}
							onEditEvent={handleEditEvent}
							onDeleteEvent={handleDeleteEvent}
						/>
					)}
					{view === "week" && (
						<WeekView
							currentDate={currentDate}
							events={events}
							selectedDate={selectedDate}
							onDateSelect={handleDateSelect}
							onEventClick={handleEventClick}
							onEditEvent={handleEditEvent}
							onDeleteEvent={handleDeleteEvent}
						/>
					)}
					{view === "day" && (
						<DayView
							currentDate={currentDate}
							events={events}
							onEventClick={handleEventClick}
							onEditEvent={handleEditEvent}
							onDeleteEvent={handleDeleteEvent}
						/>
					)}
				</div>

				<EventsSidebar
					selectedDate={selectedDate}
					events={selectedDateEvents}
					eventTypes={eventTypes}
					onEventClick={handleEventClick}
					onEditEvent={handleEditEvent}
					onDeleteEvent={handleDeleteEvent}
				/>
			</div>

			{/* Create/Edit Event Modal */}
			<CreateEventModal
				isOpen={isCreateModalOpen}
				onClose={() => {
					setIsCreateModalOpen(false);
					setEditingEvent(null);
				}}
				onCreateEvent={editingEvent ? handleUpdateEvent : handleCreateEvent}
				eventTypes={eventTypes}
				initialDate={selectedDate}
				editingEvent={editingEvent}
			/>

			{/* Delete Confirmation Modal */}
			<AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Event</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{eventToDelete?.title}"? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDeleteEvent}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
