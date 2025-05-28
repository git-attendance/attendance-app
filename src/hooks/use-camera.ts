import { useEffect, useRef, useState } from "react";

export function useCamera(facingMode: "user" | "environment" = "user") {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isCameraReady, setIsCameraReady] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const startCamera = async () => {
		try {
			const userMedia = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode,
					width: { ideal: 640 },
					height: { ideal: 480 },
				},
			});

			setStream(userMedia);
			if (videoRef.current) {
				videoRef.current.srcObject = userMedia;
				await videoRef.current.play();
				setIsCameraReady(true);
			}
			setError(null);
		} catch (err) {
			console.error("Camera error:", err);
			setError("Failed to access camera.");
		}
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		setStream(null);
		setIsCameraReady(false);
	};

	useEffect(() => {
		return () => stopCamera();
	}, []);

	return {
		videoRef,
		isCameraReady,
		error,
		startCamera,
		stopCamera,
	};
}
