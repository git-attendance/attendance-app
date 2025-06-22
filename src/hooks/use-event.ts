import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventService } from "@/services/event-service";
import type { EventModel } from "@/models/event-model";
import { toast } from "sonner";
import type { CreateEventInput } from "@/configs/event-types";

const eventService = new EventService();

const eventKeys = {
	all: ["events"],
	byId: (id: string) => ["events", id],
};

export const useEvents = (params: string) =>
	useQuery({
		queryKey: [...eventKeys.all, params],
		queryFn: () => eventService.getAllEvents(params),
	});

export const useEvent = (id: string, params: string) =>
	useQuery({
		queryKey: [...eventKeys.byId(id), params],
		queryFn: () => eventService.getEventById(id, params),
		enabled: !!id,
	});

export const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (event: CreateEventInput) => eventService.createEvent(event),
		onSuccess: () => {
			toast.success("Event created successfully");
			queryClient.invalidateQueries({ queryKey: eventKeys.all });
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.error?.message || "Failed to create event.");
		},
	});
};

export const useUpdateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, event }: { id: string; event: EventModel }) =>
			eventService.updateEvent(id, event),
		onSuccess: (_res, variables) => {
			toast.success("Event updated successfully");
			queryClient.invalidateQueries({ queryKey: eventKeys.byId(variables.id) });
			queryClient.invalidateQueries({ queryKey: eventKeys.all });
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.error?.message || "Failed to update event.");
		},
	});
};

export const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => eventService.removeEvent(id),
		onSuccess: () => {
			toast.success("Event deleted successfully");
			queryClient.invalidateQueries({ queryKey: eventKeys.all });
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.error?.message || "Failed to delete event.");
		},
	});
};
