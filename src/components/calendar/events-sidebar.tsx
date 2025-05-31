import { cn } from "@/lib/utils";
import type { CalendarEvent, EventType } from "@/models/calendar";
import { formatDate } from "@/utils/calendar-utils";
import { EventCard } from "./event-card";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventsSidebarProps {
	selectedDate: Date;
	events: CalendarEvent[];
	eventTypes: EventType[];
	onEventClick: (event: CalendarEvent) => void;
	onEventDelete?: (eventId: string) => void;
	onEventEdit?: (event: CalendarEvent) => void;
}

export const EventsSidebar = ({
	selectedDate,
	events,
	eventTypes,
	onEventClick,
	onEventDelete,
	onEventEdit,
}: EventsSidebarProps) => {
	return (
		<div className="w-80 bg-white border-l border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
			<div className="mb-6">
				<h2 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-100">
					Events
				</h2>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					{formatDate(selectedDate)}
				</p>
			</div>

			{events.length > 0 ? (
				<div className="space-y-3">
					{events.map((event) => (
						<div key={event.id} className="relative group border rounded-md">
							<EventCard event={event} onClick={onEventClick} className="p-3 pr-10" />
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<MoreVertical className="w-4 h-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem onClick={() => onEventEdit?.(event)}>
										Edit
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => onEventDelete?.(event.id)}
										className="text-red-600">
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					))}
				</div>
			) : (
				<div className="text-center py-8 text-gray-500 dark:text-gray-400">
					<div className="text-sm">No events scheduled</div>
				</div>
			)}

			<div className="mt-8">
				<h3 className="text-sm font-semibold text-gray-900 mb-3 dark:text-gray-100">
					Event Types
				</h3>
				<div className="space-y-2">
					{eventTypes.map((type) => (
						<div key={type.id} className="flex items-center space-x-2">
							<div className={cn("w-3 h-3 rounded-full", type.bgColor)} />
							<span className="text-sm text-gray-700 dark:text-gray-300">
								{type.name}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
