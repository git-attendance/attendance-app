import { type CalendarEvent } from "@/models/calendar";

export const getDaysInMonth = (date: Date): Date[] => {
	const year = date.getFullYear();
	const month = date.getMonth();
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const daysInMonth = lastDay.getDate();

	const days: Date[] = [];

	// Add previous month's days to fill the first week
	const startDayOfWeek = firstDay.getDay();
	for (let i = startDayOfWeek - 1; i >= 0; i--) {
		days.push(new Date(year, month, -i));
	}

	// Add current month's days
	for (let day = 1; day <= daysInMonth; day++) {
		days.push(new Date(year, month, day));
	}

	// Add next month's days to fill the last week
	const remainingDays = 42 - days.length; // 6 weeks × 7 days
	for (let day = 1; day <= remainingDays; day++) {
		days.push(new Date(year, month + 1, day));
	}

	return days;
};

export const getEventsForDate = (date: Date, events: CalendarEvent[]): CalendarEvent[] => {
	return events.filter((event) => {
		const eventStart = new Date(event.startDate);
		const eventEnd = new Date(event.endDate);

		// Reset time to compare dates only
		const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		const startDate = new Date(
			eventStart.getFullYear(),
			eventStart.getMonth(),
			eventStart.getDate(),
		);
		const endDate = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());

		return targetDate >= startDate && targetDate <= endDate;
	});
};

export const formatDate = (date: Date): string => {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

export const formatMonthYear = (date: Date): string => {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
	});
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
	return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
};
