import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { eventTypeConfig, type EventTypeId } from "@/configs/event-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import type { EventModel } from "@/models/event-model";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const createEventSchema = z
	.object({
		name: z.string().min(1).max(100),
		description: z.string().optional(),
		startDate: z.date(),
		endDate: z.date(),
		startTime: z.string().min(1),
		endTime: z.string().min(1),
		eventTypeId: z.enum(["academic", "examination", "holiday", "activity", "meeting"]),
		location: z.string().optional(),
	})
	.refine(
		(data) => {
			const s = new Date(data.startDate);
			const [sh, sm] = data.startTime.split(":").map(Number);
			s.setHours(sh, sm);

			const e = new Date(data.endDate);
			const [eh, em] = data.endTime.split(":").map(Number);
			e.setHours(eh, em);

			return e > s;
		},
		{ message: "End time must be after start time", path: ["endTime"] },
	);

type CreateEventFormData = z.infer<typeof createEventSchema>;

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onCreateEvent: (event: Omit<EventModel, "_id">) => void;
	initialDate?: Date;
	editingEvent?: EventModel | null;
}

export const CreateEventModal = ({
	isOpen,
	onClose,
	onCreateEvent,
	initialDate,
	editingEvent,
}: Props) => {
	const form = useForm<CreateEventFormData>({
		resolver: zodResolver(createEventSchema),
		defaultValues: {
			name: "",
			description: "",
			startDate: initialDate || new Date(),
			endDate: initialDate || new Date(),
			startTime: "09:00",
			endTime: "10:00",
			eventTypeId: "activity",
			location: "",
		},
	});

	useEffect(() => {
		if (editingEvent) {
			form.reset({
				name: editingEvent.name,
				description: editingEvent.description || "",
				startDate: editingEvent.startDate,
				endDate: editingEvent.endDate,
				startTime: editingEvent.startDate
					? format(editingEvent.startDate, "HH:mm")
					: "09:00",
				endTime: editingEvent.endDate ? format(editingEvent.endDate, "HH:mm") : "10:00",
				eventTypeId: editingEvent.type as unknown as EventTypeId,
				location: editingEvent.location || "",
			});
		} else {
			form.reset();
		}
	}, [editingEvent]);

	const onSubmit = (data: CreateEventFormData) => {
		const type = data.eventTypeId;
		const config = eventTypeConfig[type];

		const startDate = new Date(data.startDate);
		const [sh, sm] = data.startTime.split(":").map(Number);
		startDate.setHours(sh, sm);

		const endDate = new Date(data.endDate);
		const [eh, em] = data.endTime.split(":").map(Number);
		endDate.setHours(eh, em);

		onCreateEvent({
			name: data.name,
			description: data.description,
			startDate,
			endDate,
			type,
			location: data.location ?? "",
			color: config.color,
			bgColor: config.bgColor,
			organizerId: "", // TODO: Replace with actual organizerId if available
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		form.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl p-6 overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name *</FormLabel>
									<FormControl>
										<Input autoFocus {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="description"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Dates */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{["startDate", "endDate"].map((key) => (
								<FormField
									key={key}
									name={key as "startDate" | "endDate"}
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{key === "startDate" ? "Start" : "End"} Date
											</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															className="w-full justify-start">
															{field.value
																? format(field.value, "PPP")
																: "Pick a date"}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														selected={field.value}
														onSelect={field.onChange}
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
						</div>

						{/* Times */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{["startTime", "endTime"].map((key) => (
								<FormField
									key={key}
									name={key as "startTime" | "endTime"}
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{key === "startTime" ? "Start" : "End"} Time
											</FormLabel>
											<FormControl>
												<Input type="time" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}
						</div>

						{/* Type */}
						<FormField
							name="eventTypeId"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Choose type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.entries(eventTypeConfig).map(([key, val]) => (
												<SelectItem key={key} value={key}>
													<div className="flex items-center gap-2">
														<div
															className={`w-3 h-3 rounded-full ${val.bgColor}`}
														/>
														<span>{val.name}</span>
													</div>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Location */}
						<FormField
							name="location"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Location</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-2 pt-4">
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
							<Button type="submit">{editingEvent ? "Update" : "Create"}</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
