import { Camera, Check, UserCheck, X } from "lucide-react";
import { useState } from "react";
import type { User } from "@/models/test";
import FaceCamera from "@/components/features/face-camera";
import { mockUsers } from "@/configs/test/mocked-data";

const MarkAttendance = () => {
	const [stage, setStage] = useState<"idle" | "scanning" | "success" | "error">("idle");
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [recognizedUser, setRecognizedUser] = useState<User | null>(null);
	const [confidence, setConfidence] = useState<number>(0);
	console.log("MarkAttendance component rendered", capturedImage);

	const handleCapture = async (_descriptor: null, imageSrc: string | null) => {
		setStage("scanning");
		setCapturedImage(imageSrc);

		setTimeout(() => {
			const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
			const randomConfidence = Math.random() * 0.3 + 0.7;

			setRecognizedUser(randomUser);
			setConfidence(randomConfidence);
			setStage("success");
		}, 1500);
	};

	const resetAttendance = () => {
		setStage("idle");
		setCapturedImage(null);
		setRecognizedUser(null);
		setConfidence(0);
	};

	const markAttendance = () => {
		alert(`Attendance marked for ${recognizedUser?.name}`);
		resetAttendance();
	};

	return (
		<div className="flex flex-col min-h-screen w-full px-4 pb-8">
			<header className="pt-6 pb-4 text-center">
				<h1 className="text-2xl font-bold">Mark Attendance</h1>
				<p className="text-gray-400 text-sm">Facial recognition-based check-in</p>
			</header>

			<div className="flex-1 w-full max-w-md mx-auto space-y-6">
				{/* Camera Section */}
				<div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg overflow-hidden">
					<FaceCamera onCapture={handleCapture} />
				</div>

				{/* Status Panel */}
				<div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-lg">
					<h2 className="text-lg font-semibold mb-4">Status</h2>

					{stage === "idle" && (
						<div className="text-center text-gray-400 py-6">
							<Camera className="h-12 w-12 mx-auto mb-3" />
							<p>Align your face within the guide to begin</p>
						</div>
					)}

					{stage === "scanning" && (
						<div className="text-center text-gray-200 py-6 animate-pulse">
							<div className="h-12 w-12 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center">
								<UserCheck className="h-6 w-6 text-primary-400" />
							</div>
							<p className="text-sm">Scanning face...</p>
						</div>
					)}

					{stage === "success" && recognizedUser && (
						<div className="text-center py-4">
							<div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-600/20 text-green-400">
								<Check className="w-6 h-6" />
							</div>
							<h3 className="text-xl font-semibold">{recognizedUser.name}</h3>
							<p className="text-gray-400 text-sm">
								{recognizedUser.department} • {recognizedUser.role}
							</p>

							<div className="relative w-full h-2 bg-gray-700 rounded-full my-3">
								<div
									className="absolute h-full bg-green-500 rounded-full"
									style={{ width: `${confidence * 100}%` }}
								/>
							</div>
							<p className="text-xs text-gray-400">
								Confidence: {Math.round(confidence * 100)}%
							</p>

							<p className="text-green-400 bg-green-900/20 px-3 py-2 mt-4 text-sm rounded-lg">
								Face successfully recognized
							</p>

							<div className="flex gap-3 mt-4">
								<button onClick={markAttendance} className="btn btn-success w-full">
									Mark Attendance
								</button>
								<button
									onClick={resetAttendance}
									className="btn btn-outline w-full">
									Cancel
								</button>
							</div>
						</div>
					)}

					{stage === "error" && (
						<div className="text-center text-red-400 py-6">
							<X className="h-10 w-10 mx-auto mb-2" />
							<h3 className="text-lg font-semibold mb-1">Recognition Failed</h3>
							<p className="text-sm text-red-300 mb-4">
								Face not recognized. Please retry with better lighting.
							</p>
							<button className="btn btn-outline w-full" onClick={resetAttendance}>
								Try Again
							</button>
						</div>
					)}
				</div>

				{/* Tips */}
				<div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-sm text-gray-300">
					<h3 className="text-base font-medium mb-2 text-white">Tips for Best Results</h3>
					<ul className="list-disc ml-5 space-y-1">
						<li>Ensure face is evenly lit</li>
						<li>Center your face in the frame</li>
						<li>Remove sunglasses or obstructions</li>
						<li>Hold a neutral expression</li>
						<li>Retry with better angle if needed</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default MarkAttendance;
