export interface CalendarEvent {
	id: string;
	title: string;
	description?: string;
	startDate: Date;
	endDate: Date;
	type: EventType;
	location?: string;
}

export interface EventType {
	id: string;
	name: string;
	color: string;
	bgColor: string;
}

export type CalendarView = "month" | "week" | "day";

export interface CalendarViewProps {
	currentDate: Date;
	events: CalendarEvent[];
	view: CalendarView;
	onDateSelect: (date: Date) => void;
	onEventClick: (event: CalendarEvent) => void;
}
