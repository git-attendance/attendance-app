import { useState, useMemo } from "react";
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
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/use-event";
import { eventTypes } from "@/configs/test/sample-events";
import { getEventsForDate } from "@/utils/calendar-utils";
import type { CalendarView, EventModel } from "@/models/event-model";
import { useAuth } from "@/contexts/auth-context";
import { eventTypeConfig, type EventTypeMeta } from "@/configs/event-types";
import { YearView } from "./year-view";

export const CalendarTemplate = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [view, setView] = useState<CalendarView>("month");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<EventModel | null>(null);
	const [eventToDelete, setEventToDelete] = useState<EventModel | null>(null);

	const { user } = useAuth();
	const { data: events = [] } = useEvents("");
	const createEventMutation = useCreateEvent();
	const updateEventMutation = useUpdateEvent();
	const deleteEventMutation = useDeleteEvent();

	const handlePrevious = () => {
		const newDate = new Date(currentDate);
		view === "month"
			? newDate.setMonth(newDate.getMonth() - 1)
			: newDate.setDate(newDate.getDate() - (view === "week" ? 7 : 1));
		setCurrentDate(newDate);
	};

	const handleNext = () => {
		const newDate = new Date(currentDate);
		view === "month"
			? newDate.setMonth(newDate.getMonth() + 1)
			: newDate.setDate(newDate.getDate() + (view === "week" ? 7 : 1));
		setCurrentDate(newDate);
	};

	const handleToday = () => {
		const today = new Date();
		setCurrentDate(today);
		setSelectedDate(today);
	};

	const handleDateSelect = (date: Date) => setSelectedDate(date);

	const handleEventClick = (event: EventModel) => {
		toast.info(`${event.name}\n${event.description || ""}`);
	};

	const handleCreateEvent = (
		newEventData: Omit<EventModel, "_id" | "createdAt" | "updatedAt">,
	) => {
		if (!user) return;

		const typeMetaEntry = Object.entries(eventTypeConfig).find(
			([id]) => id === newEventData.type,
		);
		const typeMeta = typeMetaEntry ? typeMetaEntry[1] : undefined;
		const color = typeMeta?.color || "#000";
		const bgColor = typeMeta?.bgColor || "bg-gray-300";

		createEventMutation.mutate({
			...newEventData,
			organizerId: user._id,
			color,
			bgColor,
		});
	};

	const handleUpdateEvent = (
		updatedData: Omit<EventModel, "_id" | "createdAt" | "updatedAt">,
	) => {
		if (!editingEvent) return;

		const typeMeta = eventTypes.find((t) => t.id === updatedData.type);
		const color = typeMeta?.color || "#000";
		const bgColor = typeMeta?.bgColor || "bg-gray-300";

		updateEventMutation.mutate({
			id: editingEvent._id,
			event: {
				...updatedData,
				organizerId: editingEvent.organizerId,
				color,
				bgColor,
				_id: editingEvent._id,
				createdAt: editingEvent.createdAt,
				updatedAt: editingEvent.updatedAt,
			},
		});

		setEditingEvent(null);
	};

	const handleDeleteEvent = (eventId: string) => {
		const event = events.find((e) => e._id === eventId);
		if (event) setEventToDelete(event);
	};

	const confirmDeleteEvent = () => {
		if (!eventToDelete) return;
		deleteEventMutation.mutate(eventToDelete._id);
		setEventToDelete(null);
	};

	const handleEditEvent = (event: EventModel) => {
		setEditingEvent(event);
		setIsCreateModalOpen(true);
	};

	const selectedDateEvents = useMemo(
		() => getEventsForDate(selectedDate, events),
		[selectedDate, events],
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800 rounded-2xl">
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
					{view === "year" && (
						<YearView
							currentDate={currentDate}
							events={events}
							selectedDate={selectedDate}
							onDateSelect={handleDateSelect}
							onEventClick={handleEventClick}
							onEditEvent={handleEditEvent}
							onDeleteEvent={handleDeleteEvent}
						/>
					)}
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
					eventTypes={eventTypes as EventTypeMeta[]}
					onEventClick={handleEventClick}
					onEditEvent={handleEditEvent}
					onDeleteEvent={handleDeleteEvent}
				/>
			</div>

			<CreateEventModal
				isOpen={isCreateModalOpen}
				onClose={() => {
					setIsCreateModalOpen(false);
					setEditingEvent(null);
				}}
				onCreateEvent={editingEvent ? handleUpdateEvent : handleCreateEvent}
				initialDate={selectedDate}
				editingEvent={editingEvent}
			/>

			<AlertDialog open={!!eventToDelete} onOpenChange={() => setEventToDelete(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Event</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{eventToDelete?.name}"?
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
