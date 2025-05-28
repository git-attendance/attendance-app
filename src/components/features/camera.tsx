import { useEffect, useRef, useState } from "react";

type CameraProps = {
	facingMode?: "user" | "environment";
	onCapture: (imageData: string) => void;
	autoStart?: boolean;
};

export default function Camera({
	facingMode = "environment",
	onCapture,
	autoStart = true,
}: CameraProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);

	const startCamera = async () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode },
				audio: false,
			});

			setStream(mediaStream);
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
			}
		} catch (err) {
			console.error("Camera error:", err);
		}
	};

	const takePhoto = () => {
		if (!canvasRef.current || !videoRef.current) return;

		const width = videoRef.current.videoWidth;
		const height = videoRef.current.videoHeight;

		canvasRef.current.width = width;
		canvasRef.current.height = height;

		const ctx = canvasRef.current.getContext("2d");
		if (ctx) {
			ctx.drawImage(videoRef.current, 0, 0, width, height);
			const image = canvasRef.current.toDataURL("image/png");
			onCapture(image);
		}
	};

	useEffect(() => {
		if (autoStart) startCamera();
		return () => {
			if (stream) stream.getTracks().forEach((track) => track.stop());
		};
	}, [facingMode]);

	return (
		<div className="relative w-full max-w-md aspect-video bg-black rounded overflow-hidden">
			<video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
			<canvas ref={canvasRef} className="hidden" />
			<button
				onClick={takePhoto}
				className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded">
				📸
			</button>
		</div>
	);
}
