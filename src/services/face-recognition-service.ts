import { FACE_BASE_URL, FACE_TOKEN } from "@/configs/endpoints";
import { useAsyncFetch } from "@/hooks/use-async-fetch";

export class FaceRecognitionService {
	asyncFetch = useAsyncFetch();
	baseUrl = FACE_BASE_URL;
	token = FACE_TOKEN;

	private getHeaders() {
		return {
			token: this.token,
		};
	}

	async enrollPerson(photo: File | Blob, name: string, store = "1", collections: string[] = []) {
		const form = new FormData();
		form.append("photos", photo, "photo.jpg");
		form.append("name", name);
		form.append("store", store);
		form.append("collections", collections.join(","));
		form.append("unique", "0");

		const response = await fetch(`${this.baseUrl}/v2/person`, {
			method: "POST",
			headers: this.getHeaders(),
			body: form,
		});

		const data = await response.json();
		if (!response.ok || data.status !== "success") {
			throw new Error(data.message || "Face enrollment failed");
		}

		return {
			id: data.uuid,
			name: data.name,
			store,
			faces: data.faces,
		};
	}

	async verifyPerson(photo: File | Blob, store = "1") {
		const form = new FormData();
		form.append("photo", photo, "photo.jpg");
		form.append("store", store);

		const response = await fetch(`${this.baseUrl}/photo/search/v2`, {
			method: "POST",
			headers: this.getHeaders(),
			body: form,
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Face verification failed");
		}

		if (!Array.isArray(data) || data.length === 0) {
			throw new Error("No face match found");
		}

		const bestMatch = data[0];
		if (!bestMatch.name || bestMatch.probability < 0.8) {
			throw new Error(`Low match confidence: ${bestMatch.probability}`);
		}

		return {
			name: bestMatch.name,
			uuid: bestMatch.uuid,
			confidence: bestMatch.probability,
		};
	}

	async getPersonDetails(personId: string) {
		const res = await this.asyncFetch.get(`${this.baseUrl}/v2/person/${personId}`, {
			headers: this.getHeaders(),
		});

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.message || "Failed to fetch person details");
		}

		return await res.json();
	}
}
