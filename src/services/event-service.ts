import { useAsyncFetch } from "@/hooks/use-async-fetch";
import { APIService } from "./api-service";
import { API_ENDPOINTS } from "@/configs/endpoints";
import type { EventModel } from "@/models/event-model";

export class EventService extends APIService {
	asyncFetch = useAsyncFetch();

	getAllEvents = async (params: any): Promise<EventModel[]> => {
		try {
			const response = await this.asyncFetch.get(
				`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.EVENTS.GET_ALL}${this.query}?${params}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: EventModel[] = await response.json();
			return data;
		} catch (error) {
			console.error("Error getting all Events:", error);
			throw error;
		}
	};

	getEventById = async (id: string, params: any): Promise<EventModel> => {
		try {
			const response = await this.asyncFetch.get(
				`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.EVENTS.GET_BY_ID.replace(
					":id",
					id,
				)}${this.query}?${params}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: EventModel = await response.json();
			return data;
		} catch (error) {
			console.error("Error getting Event:", error);
			throw error;
		}
	};

	createEvent = async (event: EventModel): Promise<EventModel> => {
		try {
			const response = await this.asyncFetch.post(
				`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.EVENTS.CREATE}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(event),
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: EventModel = await response.json();
			return data;
		} catch (error) {
			console.error("Error creating Event:", error);
			throw error;
		}
	};

	updateEvent = async (id: string, event: EventModel): Promise<EventModel> => {
		try {
			const response = await this.asyncFetch.put(
				`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.EVENTS.UPDATE.replace(":id", id)}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(event),
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data: EventModel = await response.json();
			return data;
		} catch (error) {
			console.error("Error updating Event:", error);
			throw error;
		}
	};

	removeEvent = async (id: string): Promise<void> => {
		try {
			const response = await this.asyncFetch.delete(
				`${API_ENDPOINTS.BASEURL}${API_ENDPOINTS.EVENTS.REMOVE.replace(":id", id)}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error("Error removing Event:", error);
			throw error;
		}
	};
}
