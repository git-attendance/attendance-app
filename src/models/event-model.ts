export interface EventModel {
	name: string;
	date: Date;
	location: string;
	type: "academic" | "examination" | "holiday" | "activity" | "meeting";
	organizerId: string;
	createdAt: Date;
	updatedAt: Date;
}
