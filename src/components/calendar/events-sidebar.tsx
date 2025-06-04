import { cn } from "@/lib/utils";
import type { CalendarEvent, EventType } from "@/models/calendar";
import { formatDate } from "@/utils/calendar-utils";
import { EventCard } from "./event-card";

interface EventsSidebarProps {
	selectedDate: Date;
	events: CalendarEvent[];
	eventTypes: EventType[];
	onEventClick: (event: CalendarEvent) => void;
	onEditEvent: (event: CalendarEvent) => void;
	onDeleteEvent: (eventId: string) => void;
}

export const EventsSidebar = ({
	selectedDate,
	events,
	eventTypes,
	onEventClick,
	onEditEvent,
	onDeleteEvent,
}: EventsSidebarProps) => {
	return (
		<div className="w-80 bg-white border-l border-gray-200 p-6">
			<div className="mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-2">Events</h2>
				<p className="text-sm text-gray-600">{formatDate(selectedDate)}</p>
			</div>

			{events.length > 0 ? (
				<div className="space-y-3">
					{events.map((event) => (
						<EventCard
							key={event.id}
							event={event}
							onClick={onEventClick}
							onEdit={onEditEvent}
							onDelete={onDeleteEvent}
							className="p-3"
						/>
					))}
				</div>
			) : (
				<div className="text-center py-8 text-gray-500">
					<div className="text-sm">No events scheduled</div>
				</div>
			)}

			<div className="mt-8">
				<h3 className="text-sm font-semibold text-gray-900 mb-3">Event Types</h3>
				<div className="space-y-2">
					{eventTypes.map((type) => (
						<div key={type.id} className="flex items-center space-x-2">
							<div className={cn("w-3 h-3 rounded-full", type.bgColor)} />
							<span className="text-sm text-gray-700">{type.name}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
