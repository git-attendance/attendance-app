import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalendarView } from "@/models/calendar";
import { formatMonthYear } from "@/utils/calendar-utils";

interface CalendarHeaderProps {
	currentDate: Date;
	view: CalendarView;
	onPrevious: () => void;
	onNext: () => void;
	onViewChange: (view: CalendarView) => void;
	onToday: () => void;
	onCreateEventClick: () => void;
}

export const CalendarHeader = ({
	currentDate,
	view,
	onPrevious,
	onNext,
	onViewChange,
	onToday,
	onCreateEventClick,
}: CalendarHeaderProps) => {
	const viewButtons: { label: string; value: CalendarView }[] = [
		{ label: "Day", value: "day" },
		{ label: "Week", value: "week" },
		{ label: "Month", value: "month" },
	];

	return (
		<div className="flex items-center justify-between p-4 border-gray-200 dark:text-gray-50">
			<div className="flex items-center space-x-4">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
					School Calendar
				</h1>
				<Button onClick={onToday} variant="outline" size="sm">
					Today
				</Button>
				<Button variant="outline" size="sm" onClick={onCreateEventClick}>
					Create Event
					<Plus className="w-4 h-4 ml-2" />
				</Button>
			</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 dark:bg-gray-700">
					{viewButtons.map((btn) => (
						<Button
							key={btn.value}
							onClick={() => onViewChange(btn.value)}
							variant={view === btn.value ? "default" : "ghost"}
							size="sm"
							className="h-8">
							{btn.label}
						</Button>
					))}
				</div>

				<div className="flex items-center space-x-2">
					<Button onClick={onPrevious} variant="outline" size="sm">
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="text-lg font-semibold min-w-[180px] text-center">
						{formatMonthYear(currentDate)}
					</span>
					<Button onClick={onNext} variant="outline" size="sm">
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
