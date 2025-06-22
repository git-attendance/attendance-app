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
