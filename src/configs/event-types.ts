import type { EventModel } from "@/models/event-model";

export const eventTypeConfig = {
	academic: {
		name: "Academic",
		color: "#1d4ed8", // text-blue-700
		bgColor: "bg-blue-100",
	},
	examination: {
		name: "Examination",
		color: "#b91c1c", // text-red-700
		bgColor: "bg-red-100",
	},
	holiday: {
		name: "Holiday",
		color: "#15803d", // text-green-700
		bgColor: "bg-green-100",
	},
	activity: {
		name: "Activity",
		color: "#92400e", // text-amber-700
		bgColor: "bg-amber-100",
	},
	meeting: {
		name: "Meeting",
		color: "#7e22ce", // text-purple-700
		bgColor: "bg-purple-100",
	},
} as const;

export type EventTypeId = keyof typeof eventTypeConfig;

export type CreateEventInput = Omit<EventModel, "_id" | "createdAt" | "updatedAt">;

export type EventType = EventModel["type"];

export interface EventTypeMeta {
	id: EventType;
	name: string;
	color: string;
	bgColor: string;
}
