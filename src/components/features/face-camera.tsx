import { useEffect, useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";

interface FaceCameraProps {
	onCapture: (descriptor: null, imageSrc: string | null) => void;
	showGuide?: boolean;
}

const FaceCamera = ({ onCapture, showGuide = true }: FaceCameraProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	const { videoRef, error, startCamera, stopCamera } = useCamera("user");
	const [isActive, setIsActive] = useState(false);

	const captureImage = () => {
		if (!videoRef.current || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		if (!context) return;

		canvas.width = videoRef.current.videoWidth;
		canvas.height = videoRef.current.videoHeight;
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

		const imageSrc = canvas.toDataURL("image/jpeg");
		setCapturedImage(imageSrc);

		// Pass null for descriptor since face detection is removed
		onCapture(null, imageSrc);

		stopCamera();
		setIsActive(false);
	};

	const resetCamera = () => {
		setCapturedImage(null);
		startCamera();
		setIsActive(true);
	};

	useEffect(() => {
		return () => stopCamera();
	}, []);

	return (
		<div className="relative min-h-screen w-full bg-black text-white flex flex-col">
			<div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-md">
				<h2 className="text-lg font-semibold">Face Capture</h2>
				{capturedImage && (
					<button
						onClick={resetCamera}
						className="text-gray-300 hover:text-white"
						aria-label="Reset">
						<X className="w-6 h-6" />
					</button>
				)}
			</div>

			<div className="relative flex-1 w-full h-full">
				{error ? (
					<div className="flex h-full items-center justify-center text-center px-4">
						<div>
							<p className="text-red-400 mb-4">{error}</p>
							<button className="btn btn-primary w-full" onClick={resetCamera}>
								Retry
							</button>
						</div>
					</div>
				) : (
					<>
						{!isActive && !capturedImage && (
							<div className="flex h-full flex-col items-center justify-center px-4">
								<Camera className="h-12 w-12 text-gray-500 mb-4" />
								<p className="mb-4 text-gray-300">Camera is off</p>
								<button className="btn btn-primary w-full" onClick={resetCamera}>
									Turn on camera
								</button>
							</div>
						)}

						{isActive && (
							<>
								<video
									ref={videoRef}
									autoPlay
									muted
									playsInline
									className="absolute inset-0 w-full h-full object-cover z-10"
								/>
								{showGuide && (
									<div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
										<div className="h-56 w-56 rounded-full border-4 border-white/50" />
									</div>
								)}
							</>
						)}

						{capturedImage && (
							<img
								src={capturedImage}
								alt="Captured"
								className="absolute inset-0 w-full h-full object-cover z-10"
							/>
						)}
					</>
				)}
			</div>

			<div className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-black/60 backdrop-blur-md">
				{isActive && (
					<button className="btn btn-primary w-full" onClick={captureImage}>
						Capture Face
					</button>
				)}
			</div>

			<canvas ref={canvasRef} className="hidden" />
		</div>
	);
};

export default FaceCamera;
