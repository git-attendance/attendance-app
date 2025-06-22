export interface EventModel {
	_id: string;
	name: string;
	date?: Date;
	description?: string;
	location: string;
	type: "academic" | "examination" | "holiday" | "activity" | "meeting";
	organizerId: string;
	color?: string;
	bgColor?: string;
	startDate?: Date;
	endDate?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export type CalendarView = "month" | "week" | "day";

export interface CalendarViewProps {
	currentDate: Date;
	events: EventModel[];
	view: CalendarView;
	onDateSelect: (date: Date) => void;
	onEventClick: (event: EventModel) => void;
}
