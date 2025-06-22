import { useMutation, useQuery } from "@tanstack/react-query";
import { FaceRecognitionService } from "@/services/face-recognition-service";

const faceService = new FaceRecognitionService();

export const useFaceRecognition = () => {
	// Enroll a new person
	const enrollPersonMutation = useMutation({
		mutationFn: ({
			photo,
			name,
			store = "1",
			collections = [],
		}: {
			photo: File | Blob;
			name: string;
			store?: string;
			collections?: string[];
		}) => faceService.enrollPerson(photo, name, store, collections),
	});

	// Verify a person via photo
	const verifyPersonMutation = useMutation({
		mutationFn: ({ photo, store = "1" }: { photo: File | Blob; store?: string }) =>
			faceService.verifyPerson(photo, store),
	});

	// Fetch person details by ID
	const usePersonDetails = (personId: string, enabled = true) =>
		useQuery({
			queryKey: ["person", personId],
			queryFn: () => faceService.getPersonDetails(personId),
			enabled: !!personId && enabled,
		});

	return {
		enrollPersonMutation,
		verifyPersonMutation,
		usePersonDetails,
	};
};
