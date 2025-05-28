import * as faceapi from "face-api.js";

// Path to face-api.js models
const MODEL_URL = "/models";

/**
 * Load face-api.js models
 */
export async function loadModels() {
	try {
		await Promise.all([
			faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
			faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
			faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
			faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
		]);
		return true;
	} catch (error) {
		console.error("Error loading face-api.js models:", error);
		return false;
	}
}

/**
 * Extract face descriptor from an image
 * @param imageElement Image element or canvas
 * @returns Face descriptor or null if no face is detected
 */
export async function getFaceDescriptor(
	imageElement: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
): Promise<Float32Array | null> {
	try {
		// Detect all faces and compute descriptors
		const detections = await faceapi
			.detectAllFaces(imageElement)
			.withFaceLandmarks()
			.withFaceDescriptors();

		// Return the first face descriptor if any
		if (detections.length > 0) {
			return detections[0].descriptor;
		}

		return null;
	} catch (error) {
		console.error("Error getting face descriptor:", error);
		return null;
	}
}

/**
 * Compare face descriptors and return similarity score
 * @param descriptor1 First face descriptor
 * @param descriptor2 Second face descriptor
 * @returns Similarity score between 0 and 1
 */
export function compareFaces(descriptor1: Float32Array, descriptor2: Float32Array): number {
	if (!descriptor1 || !descriptor2) return 0;

	// Calculate Euclidean distance
	return 1 - faceapi.euclideanDistance(descriptor1, descriptor2);
}

/**
 * Find best match from a list of known faces
 * @param currentDescriptor The face descriptor to match
 * @param knownDescriptors Array of known face descriptors
 * @param threshold Minimum similarity threshold (0-1)
 * @returns Index of the best match or -1 if no match is found
 */
export function findBestMatch(
	currentDescriptor: Float32Array,
	knownDescriptors: Float32Array[],
	threshold = 0.6,
): { index: number; similarity: number } {
	if (!currentDescriptor || knownDescriptors.length === 0) {
		return { index: -1, similarity: 0 };
	}

	let bestMatchIndex = -1;
	let bestMatchSimilarity = 0;

	// Find best match
	for (let i = 0; i < knownDescriptors.length; i++) {
		const similarity = compareFaces(currentDescriptor, knownDescriptors[i]);

		if (similarity > threshold && similarity > bestMatchSimilarity) {
			bestMatchIndex = i;
			bestMatchSimilarity = similarity;
		}
	}

	return {
		index: bestMatchIndex,
		similarity: bestMatchSimilarity,
	};
}

/**
 * Draw face detection results on canvas
 * @param canvas Canvas element
 * @param imageElement Image or video element
 */
export async function drawFaceDetections(
	canvas: HTMLCanvasElement,
	imageElement: HTMLImageElement | HTMLVideoElement,
) {
	// Clear previous drawings
	const ctx = canvas.getContext("2d");
	if (ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	// Adjust canvas size to match image/video
	canvas.width = imageElement.width;
	canvas.height = imageElement.height;

	// Detect faces with landmarks
	const detections = await faceapi.detectAllFaces(imageElement).withFaceLandmarks();

	// Draw results
	faceapi.draw.drawDetections(canvas, detections);
	faceapi.draw.drawFaceLandmarks(canvas, detections);
}
