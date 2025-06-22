import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAttendance } from "@/hooks/use-attendance";
import { useStudent } from "@/hooks/use-student";

interface FaceCaptureProps {
	onSuccess: (enrolled: { id: string; name: string }) => void;
	studentName: string;
	studentId: string;
}

const FaceCapture = ({ onSuccess, studentName, studentId }: FaceCaptureProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const [isCapturing, setIsCapturing] = useState(false);
	const [hasCaptured, setHasCaptured] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const { enrollFace } = useAttendance();
	const { uploadImage } = useStudent();

	const startCamera = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { width: 640, height: 480, facingMode: "user" },
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				setIsStreaming(true);
			}
		} catch (error) {
			console.error("Camera access failed:", error);
			toast.error("Unable to access camera. Please check permissions.");
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

			const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
			setImagePreview(dataUrl);
			setHasCaptured(true);
			stopCamera();

			setIsCapturing(false);
			toast.success("Image captured. Ready to enroll.");
		}, 100);
	}, [stopCamera]);

	const reset = () => {
		setHasCaptured(false);
		setImagePreview(null);
		startCamera();
	};

	const handleEnroll = async () => {
		if (!canvasRef.current) return;

		canvasRef.current.toBlob(
			(blob) => {
				if (!blob) {
					toast.error("Failed to capture image blob");
					return;
				}

				const file = new File([blob], "face.jpg", { type: "image/jpeg" });

				// Upload to student's profile image
				uploadImage.mutate(
					{ studentId, file },
					{
						onSuccess: () => {
							toast.success("Student image uploaded.");
						},
						onError: () => {
							toast.error("Image upload failed.");
						},
					},
				);

				enrollFace.mutate(
					{ photo: file, studentId },
					{
						onSuccess: (res) => {
							onSuccess({ id: res.personId, name: studentName });
						},
						onError: (err: any) => {
							toast.error(err?.error?.message || "Enrollment failed.");
						},
					},
				);
			},
			"image/jpeg",
			0.8,
		);
	};

	useEffect(() => {
		startCamera();
		return () => stopCamera();
	}, [startCamera, stopCamera]);

	return (
		<Card className="w-full max-w-xl mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Camera className="h-5 w-5" />
					Face Enrollment - {studentName}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
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
						<div className="absolute inset-0 bg-white bg-opacity-30 flex items-center justify-center">
							<Camera className="h-10 w-10 text-blue-600 animate-pulse" />
						</div>
					)}
				</div>

				{imagePreview && (
					<div className="text-center">
						<p className="text-sm mb-2">Captured Preview:</p>
						<img
							src={imagePreview}
							alt="Preview"
							className="w-40 h-40 object-cover mx-auto rounded border"
						/>
					</div>
				)}

				<div className="flex justify-center space-x-3">
					{!isStreaming && !hasCaptured && (
						<Button onClick={startCamera} className="flex items-center gap-2">
							<Camera className="h-4 w-4" />
							Start Camera
						</Button>
					)}

					{isStreaming && !hasCaptured && (
						<>
							<Button
								onClick={captureImage}
								disabled={isCapturing}
								className="flex items-center gap-2">
								<Camera className="h-4 w-4" />
								{isCapturing ? "Capturing..." : "Capture Photo"}
							</Button>
							<Button variant="outline" onClick={stopCamera}>
								<X className="h-4 w-4" />
								Stop
							</Button>
						</>
					)}

					{hasCaptured && (
						<>
							<Button onClick={handleEnroll} disabled={enrollFace.isPending}>
								{enrollFace.isPending ? "Enrolling..." : "Enroll Face"}
							</Button>
							<Button variant="outline" onClick={reset}>
								<X className="h-4 w-4" />
								Retake
							</Button>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

export default FaceCapture;
