import { type CalendarEvent, type EventType } from "@/models/calendar";

export const eventTypes: EventType[] = [
	{ id: "academic", name: "Academic", color: "text-blue-700", bgColor: "bg-blue-100" },
	{ id: "examination", name: "Examination", color: "text-red-700", bgColor: "bg-red-100" },
	{ id: "holiday", name: "Holiday", color: "text-green-700", bgColor: "bg-green-100" },
	{ id: "activity", name: "Activity", color: "text-purple-700", bgColor: "bg-purple-100" },
	{ id: "meeting", name: "Meeting", color: "text-orange-700", bgColor: "bg-orange-100" },
];

// Create events for the current month and nearby months to ensure visibility
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

export const sampleEvents: CalendarEvent[] = [
	{
		id: "1",
		title: "Start of Enrollment Period",
		startDate: new Date(currentYear, currentMonth, 3),
		endDate: new Date(currentYear, currentMonth, 3),
		type: eventTypes[0], // Academic
		description: "Beginning of student enrollment for the new academic year",
	},
	{
		id: "2",
		title: "Brigada Eskwela National Kick-off",
		startDate: new Date(currentYear, currentMonth, 10),
		endDate: new Date(currentYear, currentMonth, 10),
		type: eventTypes[3], // Activity
		description: "National school preparation activity",
	},
	{
		id: "3",
		title: "Parent-Teacher Conference",
		startDate: new Date(currentYear, currentMonth, 15),
		endDate: new Date(currentYear, currentMonth, 15),
		type: eventTypes[4], // Meeting
		description: "Quarterly meeting with parents",
	},
	{
		id: "4",
		title: "Midterm Examinations",
		startDate: new Date(currentYear, currentMonth, 20),
		endDate: new Date(currentYear, currentMonth, 22),
		type: eventTypes[1], // Examination
		description: "Mid-semester examinations for all students",
	},
	{
		id: "5",
		title: "School Holiday",
		startDate: new Date(currentYear, currentMonth, 25),
		endDate: new Date(currentYear, currentMonth, 25),
		type: eventTypes[2], // Holiday
		description: "Special holiday - no classes",
	},
	{
		id: "6",
		title: "Science Fair",
		startDate: new Date(currentYear, currentMonth + 1, 5),
		endDate: new Date(currentYear, currentMonth + 1, 5),
		type: eventTypes[3], // Activity
		description: "Annual science fair and exhibition",
	},
	{
		id: "7",
		title: "Final Examinations",
		startDate: new Date(currentYear, currentMonth + 1, 15),
		endDate: new Date(currentYear, currentMonth + 1, 17),
		type: eventTypes[1], // Examination
		description: "End of semester final examinations",
	},
	{
		id: "8",
		title: "Staff Meeting",
		startDate: new Date(currentYear, currentMonth + 1, 28),
		endDate: new Date(currentYear, currentMonth + 1, 28),
		type: eventTypes[4], // Meeting
		description: "Monthly staff coordination meeting",
	},
	{
		id: "9",
		title: "Sports Day",
		startDate: new Date(currentYear, currentMonth - 1, 12),
		endDate: new Date(currentYear, currentMonth - 1, 12),
		type: eventTypes[3], // Activity
		description: "Annual sports competition",
	},
	{
		id: "10",
		title: "Academic Planning",
		startDate: new Date(currentYear, currentMonth - 1, 20),
		endDate: new Date(currentYear, currentMonth - 1, 20),
		type: eventTypes[0], // Academic
		description: "Curriculum planning session",
	},
];
