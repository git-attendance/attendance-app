import { type CalendarEvent } from "@/models/calendar";

const EVENTS_STORAGE_KEY = "calendar-events";

export const eventStorageService = {
	getEvents: (): CalendarEvent[] => {
		try {
			const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
			if (!storedEvents) return [];

			const parsedEvents = JSON.parse(storedEvents);
			// Convert date strings back to Date objects
			return parsedEvents.map((event: any) => ({
				...event,
				startDate: new Date(event.startDate),
				endDate: new Date(event.endDate),
			}));
		} catch (error) {
			console.error("Error loading events from localStorage:", error);
			return [];
		}
	},

	saveEvents: (events: CalendarEvent[]): void => {
		try {
			localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
		} catch (error) {
			console.error("Error saving events to localStorage:", error);
		}
	},

	addEvent: (newEvent: CalendarEvent): void => {
		const existingEvents = eventStorageService.getEvents();
		const updatedEvents = [...existingEvents, newEvent];
		eventStorageService.saveEvents(updatedEvents);
	},

	removeEvent: (eventId: string): void => {
		const existingEvents = eventStorageService.getEvents();
		const updatedEvents = existingEvents.filter((event) => event.id !== eventId);
		eventStorageService.saveEvents(updatedEvents);
	},

	updateEvent: (updatedEvent: CalendarEvent): void => {
		const existingEvents = eventStorageService.getEvents();
		const updatedEvents = existingEvents.map((event) =>
			event.id === updatedEvent.id ? updatedEvent : event,
		);
		eventStorageService.saveEvents(updatedEvents);
	},
};
