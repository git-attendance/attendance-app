import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { CalendarEvent, EventType } from "@/models/calendar";

const createEventSchema = z
	.object({
		title: z
			.string()
			.min(1, "Title is required")
			.max(100, "Title must be less than 100 characters"),
		description: z.string().optional(),
		startDate: z.date({
			required_error: "Start date is required",
		}),
		endDate: z.date({
			required_error: "End date is required",
		}),
		startTime: z.string().min(1, "Start time is required"),
		endTime: z.string().min(1, "End time is required"),
		eventTypeId: z.string().min(1, "Event type is required"),
		location: z.string().optional(),
	})
	.refine(
		(data) => {
			const startDateTime = new Date(data.startDate);
			const [startHours, startMinutes] = data.startTime.split(":").map(Number);
			startDateTime.setHours(startHours, startMinutes);

			const endDateTime = new Date(data.endDate);
			const [endHours, endMinutes] = data.endTime.split(":").map(Number);
			endDateTime.setHours(endHours, endMinutes);

			return endDateTime > startDateTime;
		},
		{
			message: "End time must be after start time",
			path: ["endTime"],
		},
	);

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface CreateEventModalProps {
	isOpen: boolean;
	onClose: () => void;
	onCreateEvent: (event: Omit<CalendarEvent, "id">) => void;
	eventTypes: EventType[];
	initialDate?: Date;
	editingEvent?: CalendarEvent | null;
}

export const CreateEventModal = ({
	isOpen,
	onClose,
	onCreateEvent,
	eventTypes,
	initialDate,
	editingEvent,
}: CreateEventModalProps) => {
	const form = useForm<CreateEventFormData>({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			title: editingEvent?.title || "",
			description: editingEvent?.description || "",
			startDate: editingEvent?.startDate || initialDate || new Date(),
			endDate: editingEvent?.endDate || initialDate || new Date(),
			startTime: editingEvent
				? `${String(editingEvent.startDate.getHours()).padStart(2, "0")}:${String(editingEvent.startDate.getMinutes()).padStart(2, "0")}`
				: "09:00",
			endTime: editingEvent
				? `${String(editingEvent.endDate.getHours()).padStart(2, "0")}:${String(editingEvent.endDate.getMinutes()).padStart(2, "0")}`
				: "10:00",
			eventTypeId: editingEvent?.type.id || "",
			location: editingEvent?.location || "",
		},
	});

	// Reset form when editingEvent changes
	useEffect(() => {
		if (editingEvent) {
			form.reset({
				title: editingEvent.title,
				description: editingEvent.description || "",
				startDate: editingEvent.startDate,
				endDate: editingEvent.endDate,
				startTime: `${String(editingEvent.startDate.getHours()).padStart(2, "0")}:${String(editingEvent.startDate.getMinutes()).padStart(2, "0")}`,
				endTime: `${String(editingEvent.endDate.getHours()).padStart(2, "0")}:${String(editingEvent.endDate.getMinutes()).padStart(2, "0")}`,
				eventTypeId: editingEvent.type.id,
				location: editingEvent.location || "",
			});
		} else {
			form.reset({
				title: "",
				description: "",
				startDate: initialDate || new Date(),
				endDate: initialDate || new Date(),
				startTime: "09:00",
				endTime: "10:00",
				eventTypeId: "",
				location: "",
			});
		}
	}, [editingEvent, initialDate, form]);

	const onSubmit = (data: CreateEventFormData) => {
		const selectedEventType = eventTypes.find((type) => type.id === data.eventTypeId);
		if (!selectedEventType) return;

		// Combine date and time for start and end
		const startDateTime = new Date(data.startDate);
		const [startHours, startMinutes] = data.startTime.split(":").map(Number);
		startDateTime.setHours(startHours, startMinutes);

		const endDateTime = new Date(data.endDate);
		const [endHours, endMinutes] = data.endTime.split(":").map(Number);
		endDateTime.setHours(endHours, endMinutes);

		const newEvent: Omit<CalendarEvent, "id"> = {
			title: data.title,
			description: data.description,
			startDate: startDateTime,
			endDate: endDateTime,
			type: selectedEventType,
			location: data.location,
		};

		onCreateEvent(newEvent);
		form.reset();
		onClose();
	};

	const handleClose = () => {
		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Title *</FormLabel>
									<FormControl>
										<Input placeholder="Enter event title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter event description (optional)"
											className="min-h-[80px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>Start Date *</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
													className={cn("p-3 pointer-events-auto")}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										<FormLabel>End Date *</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}>
														{field.value ? (
															format(field.value, "PPP")
														) : (
															<span>Pick a date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													initialFocus
													className={cn("p-3 pointer-events-auto")}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Start Time *</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>End Time *</FormLabel>
										<FormControl>
											<Input type="time" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="eventTypeId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Event Type *</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select an event type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{eventTypes.map((type) => (
												<SelectItem key={type.id} value={type.id}>
													<div className="flex items-center space-x-2">
														<div
															className={cn(
																"w-3 h-3 rounded-full",
																type.bgColor,
															)}
														/>
														<span>{type.name}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter event location (optional)"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-3 pt-4">
							<Button type="button" variant="outline" onClick={handleClose}>
								Cancel
							</Button>
							<Button type="submit" className="bg-blue-600 hover:bg-blue-700">
								{editingEvent ? "Update Event" : "Create Event"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
