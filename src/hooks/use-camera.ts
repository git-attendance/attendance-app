import { useCallback, useEffect, useState } from "react";

interface CameraDevice {
	deviceId: string;
	label: string;
}

interface UseCameraProps {
	onError?: (error: string) => void;
}

export const useCamera = ({ onError }: UseCameraProps = {}) => {
	const [devices, setDevices] = useState<CameraDevice[]>([]);
	const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const getDevices = useCallback(async () => {
		try {
			// Request permissions first
			const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
			tempStream.getTracks().forEach((track) => track.stop());

			const deviceList = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = deviceList
				.filter((device) => device.kind === "videoinput")
				.map((device, index) => ({
					deviceId: device.deviceId,
					label: device.label || `Camera ${index + 1}`,
				}));

			// Only log if devices actually changed
			if (JSON.stringify(videoDevices) !== JSON.stringify(devices)) {
				console.log("Available cameras:", videoDevices);
			}
			setDevices(videoDevices);

			// Set default to first device if none selected
			if (videoDevices.length > 0 && !selectedDeviceId) {
				setSelectedDeviceId(videoDevices[0].deviceId);
			}
		} catch (error) {
			console.error("Error getting camera devices:", error);
			onError?.("Unable to access camera devices. Please check permissions.");
		}
	}, [selectedDeviceId, onError]);

	const startCamera = useCallback(
		async (videoRef: React.RefObject<HTMLVideoElement>) => {
			if (!videoRef.current) return;

			setIsLoading(true);
			console.log("Starting camera with device:", selectedDeviceId);

			try {
				// Stop existing stream
				if (stream) {
					stream.getTracks().forEach((track) => track.stop());
				}

				const constraints: MediaStreamConstraints = {
					video: {
						deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined,
						width: 640,
						height: 480,
					},
				};

				console.log("Camera constraints:", constraints);
				const newStream = await navigator.mediaDevices.getUserMedia(constraints);
				setStream(newStream);
				videoRef.current.srcObject = newStream;
				console.log("Camera started successfully");
			} catch (error) {
				console.error("Error starting camera:", error);
				onError?.("Unable to start camera. Please check permissions and try again.");
			} finally {
				setIsLoading(false);
			}
		},
		[selectedDeviceId, stream, onError],
	);

	// Function to switch camera while streaming
	const switchCamera = useCallback(
		async (newDeviceId: string, videoRef: React.RefObject<HTMLVideoElement>) => {
			if (!videoRef.current) return;

			setSelectedDeviceId(newDeviceId);

			// If currently streaming, restart with new camera
			if (stream) {
				await startCamera(videoRef);
			}
		},
		[stream, startCamera],
	);

	const stopCamera = useCallback(() => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
		}
	}, [stream]);

	useEffect(() => {
		getDevices();
	}, [getDevices]);

	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, [stopCamera]);

	return {
		devices,
		selectedDeviceId,
		setSelectedDeviceId,
		startCamera,
		stopCamera,
		switchCamera,
		isLoading,
		isStreaming: !!stream,
	};
};
