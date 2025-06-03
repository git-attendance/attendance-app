import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface FaceCaptureProps {
	onCapture: (images: string[]) => void;
	onComplete: () => void;
	studentName?: string;
}

const REQUIRED_ANGLES = [
	"Front Face",
	"Left Profile",
	"Right Profile",
	"Slight Up Angle",
	"Slight Down Angle",
];

const FaceCapture = ({ onCapture, onComplete, studentName }: FaceCaptureProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const [capturedImages, setCapturedImages] = useState<string[]>([]);
	const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
	const [isCapturing, setIsCapturing] = useState(false);

	const startCamera = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: 640,
					height: 480,
					facingMode: "user",
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				setIsStreaming(true);
			}
		} catch (error) {
			console.error("Error accessing camera:", error);
			toast.error(
				<div>
					<strong>Camera Error</strong>
					<br />
					<span>Unable to access camera. Please check permissions.</span>
				</div>,
			);
		}
	}, []);

	const stopCamera = useCallback(() => {
		if (videoRef.current?.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			stream.getTracks().forEach((track) => track.stop());
			videoRef.current.srcObject = null;
			setIsStreaming(false);
		}
	}, []);

	const captureImage = useCallback(() => {
		if (!videoRef.current || !canvasRef.current) return;

		setIsCapturing(true);

		setTimeout(() => {
			const canvas = canvasRef.current!;
			const video = videoRef.current!;
			const ctx = canvas.getContext("2d")!;

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			ctx.drawImage(video, 0, 0);

			const imageData = canvas.toDataURL("image/jpeg", 0.8);
			const newImages = [...capturedImages, imageData];
			setCapturedImages(newImages);

			if (currentAngleIndex < REQUIRED_ANGLES.length - 1) {
				setCurrentAngleIndex((prev) => prev + 1);
				toast(
					<>
						<strong>Image Captured</strong>
						<br />
						{`${REQUIRED_ANGLES[currentAngleIndex]} captured. Please position for: ${REQUIRED_ANGLES[currentAngleIndex + 1]}`}
					</>,
				);
			} else {
				toast.success(
					"All Images Captured. Face registration complete! You can now save the student.",
				);
				onCapture(newImages);
				stopCamera();
			}

			setIsCapturing(false);
		}, 100);
	}, [capturedImages, currentAngleIndex, onCapture, stopCamera]);

	const resetCapture = () => {
		setCapturedImages([]);
		setCurrentAngleIndex(0);
		if (!isStreaming) {
			startCamera();
		}
	};

	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, [stopCamera]);

	const currentAngle = REQUIRED_ANGLES[currentAngleIndex];
	const isComplete = capturedImages.length === REQUIRED_ANGLES.length;

	return (
		<Card className="w-full max-w-2xl mx-auto dark:bg-gray-800">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Camera className="h-5 w-5" />
					Face Registration - {studentName || "New Student"}
				</CardTitle>
				<p className="text-sm text-gray-600 dark:text-gray-400">
					Capture {REQUIRED_ANGLES.length} different angles for accurate face recognition
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Progress Indicator */}
				<div className="flex justify-center space-x-2 mb-4">
					{REQUIRED_ANGLES.map((angle, index) => (
						<div
							key={angle}
							className={`w-3 h-3 rounded-full transition-colors ${
								index < capturedImages.length
									? "bg-green-500"
									: index === currentAngleIndex
										? "bg-blue-500 dark:bg-blue-600"
										: "bg-gray-300 dark:bg-gray-600"
							}`}
							title={angle}
						/>
					))}
				</div>

				{/* Current Instruction */}
				{!isComplete && (
					<div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 dark:bg-blue-900 dark:border-blue-700">
						<p className="font-medium text-blue-800 dark:text-blue-200">
							Position #{currentAngleIndex + 1}: {currentAngle}
						</p>
						<p className="text-sm text-blue-600 mt-1 dark:text-blue-300">
							Look directly at the camera and ensure good lighting
						</p>
					</div>
				)}

				{/* Video Feed */}
				<div className="relative bg-gray-900 rounded-lg overflow-hidden">
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						className="w-full h-80 object-cover"
					/>
					<canvas ref={canvasRef} className="hidden" />

					{isCapturing && (
						<div className="absolute inset-0 bg-white bg-opacity-30 flex items-center justify-center dark:bg-gray-800 dark:bg-opacity-50">
							<div className="bg-white rounded-full p-3">
								<Camera className="h-8 w-8 text-blue-600" />
							</div>
						</div>
					)}

					{/* Overlay guides */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-white border-dashed rounded-lg"></div>
					</div>
				</div>

				{/* Preview of captured images */}
				{capturedImages.length > 0 && (
					<div className="grid grid-cols-5 gap-2">
						{capturedImages.map((image, index) => (
							<div key={index} className="relative">
								<img
									src={image}
									alt={`Capture ${index + 1}`}
									className="w-full h-16 object-cover rounded border"
								/>
								<div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
									<Check className="h-3 w-3" />
								</div>
							</div>
						))}
					</div>
				)}

				{/* Controls */}
				<div className="flex justify-center space-x-3">
					{!isStreaming && !isComplete && (
						<Button onClick={startCamera} className="flex items-center gap-2">
							<Camera className="h-4 w-4" />
							Start Camera
						</Button>
					)}

					{isStreaming && !isComplete && (
						<>
							<Button
								onClick={captureImage}
								disabled={isCapturing}
								className="flex items-center gap-2">
								<Camera className="h-4 w-4" />
								{isCapturing ? "Capturing..." : `Capture ${currentAngle}`}
							</Button>
							<Button
								variant="outline"
								onClick={stopCamera}
								className="flex items-center gap-2">
								<X className="h-4 w-4" />
								Stop
							</Button>
						</>
					)}

					{capturedImages.length > 0 && (
						<Button
							variant="outline"
							onClick={resetCapture}
							className="flex items-center gap-2">
							<RotateCcw className="h-4 w-4" />
							Reset
						</Button>
					)}

					{isComplete && (
						<Button
							onClick={onComplete}
							className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
							<Check className="h-4 w-4" />
							Complete Registration
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default FaceCapture;
