import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, UserCheck, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CameraSelector } from "@/components/features/camera-selector";
import { useCamera } from "@/hooks/use-camera";
import { useSubjectsByInstructor } from "@/hooks/use-subjects";
import { useAuth } from "@/contexts/auth-context";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { SubjectModel } from "@/models/subject-model";
import { useAttendance } from "@/hooks/use-attendance";
import type { AttendanceModel } from "@/models/attendance-model";
import Avatar from "@/components/ui/avatar";
import { useLiveAttendanceSync } from "@/hooks/live-attendance-sync";
import { useQueryClient } from "@tanstack/react-query";

const StudentAttendance = () => {
	const { user } = useAuth();
	const { process, getToday } = useAttendance();
	const { data: todaySummary } = getToday;
	const instructorSubjects = useSubjectsByInstructor(user?._id || "");
	const todayRecords: AttendanceModel[] = todaySummary?.records ?? [];
	const queryClient = useQueryClient();

	// Enable live attendance sync
	useLiveAttendanceSync();

	const videoRef = useRef<HTMLVideoElement>(null!) as React.RefObject<HTMLVideoElement>;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
	const [recognizedResult, setRecognizedResult] = useState<any>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const {
		devices,
		selectedDeviceId,
		setSelectedDeviceId,
		startCamera,
		stopCamera,
		switchCamera,
		isLoading,
		isStreaming,
	} = useCamera({
		onError: (error) => {
			toast.error(error);
			setIsProcessing(false);
		},
	});

	const handleStartCamera = () => {
		if (!selectedSubjectId) {
			toast.warning("Please select a subject first.");
			return;
		}
		startCamera(videoRef);
	};

	const handleFaceRecognition = useCallback(async () => {
		if (!selectedSubjectId) {
			toast.warning("Subject is required.");
			return;
		}
		if (!videoRef.current || !canvasRef.current) return;

		setIsProcessing(true);
		const canvas = canvasRef.current;
		const video = videoRef.current;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);

		canvas.toBlob((blob) => {
			if (!blob) {
				toast.error("Failed to capture image.");
				setIsProcessing(false);
				return;
			}

			const file = new File([blob], "snapshot.jpg", { type: "image/jpeg" });

			process.mutate(
				{ photo: file, subjectId: selectedSubjectId },
				{
					onSuccess: (res) => {
						setRecognizedResult(res.data);
						toast.success(res.message || "Attendance recorded.");

						// Optimistically update the cache with the new attendance record
						try {
							queryClient.setQueryData(["attendance", "today"], (oldData: any) => {
								if (!oldData || !res.data) return oldData;

								// Safely access response data with fallbacks
								const responseData = res.data;

								// Only proceed if we have the minimum required data
								if (!responseData.studentId?._id) {
									console.warn(
										"Insufficient data for optimistic update:",
										responseData,
									);
									return oldData;
								}

								// Create new attendance record from the response
								const newRecord = {
									_id: responseData._id || `temp-${Date.now()}`,
									studentId: responseData.studentId,
									subjectId: responseData.subjectId,
									attendanceStatus: responseData.attendanceStatus || "present",
									checkInTime:
										responseData.checkInTime || new Date().toISOString(),
									checkOutTime: responseData.checkOutTime,
									personId: responseData.personId,
									status: responseData.status || "checked-in",
									confidence: responseData.confidence,
									createdAt: responseData.createdAt || new Date().toISOString(),
									updatedAt: responseData.updatedAt || new Date().toISOString(),
								};

								// Check if record already exists to avoid duplicates
								const existingRecordIndex = oldData.records?.findIndex(
									(record: any) =>
										record.studentId?._id === newRecord.studentId?._id,
								);

								if (existingRecordIndex >= 0) {
									// Update existing record
									const updatedRecords = [...(oldData.records || [])];
									updatedRecords[existingRecordIndex] = newRecord;
									return {
										...oldData,
										records: updatedRecords,
									};
								} else {
									// Add new record
									return {
										...oldData,
										records: [...(oldData.records || []), newRecord],
										total: (oldData.total || 0) + 1,
										present: (oldData.present || 0) + 1,
									};
								}
							});
						} catch (error) {
							console.error("Error in optimistic update:", error);
							// Continue execution even if optimistic update fails
						}

						// Also refetch to ensure data consistency
						setTimeout(() => {
							getToday.refetch();
						}, 500);

						stopCamera();
					},
					onError: (err) => {
						toast.error("Face not recognized or attendance failed.");
						console.error(err);
					},
					onSettled: () => {
						setIsProcessing(false);
					},
				},
			);
		}, "image/jpeg");
	}, [selectedSubjectId, videoRef, canvasRef, process, stopCamera]);

	const getTodayAttendance = () => {
		if (!recognizedResult?.studentId?._id) return null;

		const found = todayRecords.find((r: any) => {
			return r.studentId?._id === recognizedResult.studentId._id;
		});

		return found;
	};

	useEffect(() => {
		return () => stopCamera();
	}, [stopCamera]);

	return (
		<div className="space-y-6">
			<header className="flex justify-between items-start">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Student Attendance
					</h1>
					<p className="text-gray-600 mt-2">
						Use face recognition to mark attendance —{" "}
						{format(new Date(), "EEEE, MMMM d, yyyy")}
					</p>
				</div>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="dark:bg-gray-800 dark:text-white">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Camera className="h-5 w-5" /> Face Recognition Check-in
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<CameraSelector
								devices={devices}
								selectedDeviceId={selectedDeviceId}
								onDeviceChange={setSelectedDeviceId}
								disabled={isProcessing || isLoading}
								isStreaming={isStreaming}
								switchCamera={switchCamera}
							/>
							<div className="space-y-2">
								<Label>Select a Subject</Label>
								<Select
									value={selectedSubjectId}
									onValueChange={(value) => setSelectedSubjectId(value)}>
									<SelectTrigger>
										<SelectValue placeholder="Choose subject" />
									</SelectTrigger>
									<SelectContent>
										{instructorSubjects.data?.map((subject: SubjectModel) => (
											<SelectItem key={subject._id} value={subject._id}>
												{subject.name} ({subject.code}) —{" "}
												{subject.schedule.day}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="relative bg-gray-900 rounded-lg overflow-hidden">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className="w-full h-64 object-cover"
							/>
							<canvas ref={canvasRef} className="hidden" />

							{isProcessing && (
								<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
									<div className="bg-white p-4 rounded flex items-center gap-2">
										<div className="animate-spin h-6 w-6 rounded-full border-b-2 border-blue-600" />
										<span>Recognizing face...</span>
									</div>
								</div>
							)}

							{/* Face overlay */}
							<div className="absolute inset-0 pointer-events-none">
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-white border-dashed rounded-lg" />
							</div>
						</div>

						{/* Controls */}
						<div className="flex gap-3">
							{!isStreaming && !recognizedResult && (
								<Button onClick={handleStartCamera}>
									<Camera className="h-4 w-4" /> Start Camera
								</Button>
							)}
							{isStreaming && !recognizedResult && (
								<Button onClick={handleFaceRecognition} disabled={isProcessing}>
									<Camera className="h-4 w-4" />
									{isProcessing ? "Processing..." : "Recognize Face"}
								</Button>
							)}
							{isStreaming && (
								<Button variant="outline" onClick={stopCamera}>
									Stop Camera
								</Button>
							)}
						</div>

						{/* Student Info */}
						{recognizedResult && (
							<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
								<div className="flex items-center gap-4">
									<Avatar
										src={recognizedResult.studentId?.image}
										alt={`${recognizedResult.studentId?.firstName} ${recognizedResult.studentId?.lastName}`}
										size="large"
									/>
									<div className="flex-1">
										<h3 className="font-semibold text-green-800 dark:text-green-200 text-lg">
											{recognizedResult.studentId?.firstName}{" "}
											{recognizedResult.studentId?.lastName}
										</h3>
										<p className="text-sm text-green-600 dark:text-green-400">
											Student ID: {recognizedResult.studentId?.studentId}
										</p>
										<p className="text-sm text-green-600 dark:text-green-400">
											{recognizedResult.studentId?.section}
											{recognizedResult.studentId?.strand
												? ` - ${recognizedResult.studentId?.strand}`
												: ""}
										</p>
										<p className="text-xs text-green-500 dark:text-green-500 mt-1">
											Confidence:{" "}
											{(recognizedResult.confidence * 100).toFixed(1)}%
										</p>
									</div>
									<div className="text-right">
										<div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
											<UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
										</div>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Today’s Status */}
				<Card className="dark:bg-gray-800 dark:text-white">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" /> Your Attendance Today
						</CardTitle>
					</CardHeader>
					<CardContent>
						{recognizedResult ? (
							(() => {
								const attendance = getTodayAttendance();
								const student = recognizedResult.studentId;

								return attendance ? (
									<div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
										<div className="flex items-center gap-4">
											<Avatar
												src={student?.image}
												alt={`${student?.firstName} ${student?.lastName}`}
												size="large"
											/>
											<div className="flex-1">
												<p className="font-medium text-green-800 dark:text-green-200 text-lg">
													✓ Already Checked In
												</p>
												<p className="text-sm text-green-600 dark:text-green-400">
													Time:{" "}
													{format(
														new Date(attendance.checkInTime),
														"h:mm aa",
													)}
												</p>
												<p className="text-sm text-green-600 dark:text-green-400">
													Status:{" "}
													{attendance.attendanceStatus === "present"
														? "Present"
														: "Absent"}
												</p>
												{attendance.checkOutTime && (
													<p className="text-sm text-green-600 dark:text-green-400">
														Check Out:{" "}
														{format(
															new Date(attendance.checkOutTime),
															"h:mm aa",
														)}
													</p>
												)}
											</div>
											<div className="text-right">
												<UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
											</div>
										</div>
									</div>
								) : (
									<div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
										<div className="flex items-center gap-4">
											<Avatar
												src={student?.image}
												alt={`${student?.firstName} ${student?.lastName}`}
												size="large"
											/>
											<div className="flex-1">
												<p className="font-medium text-yellow-800 dark:text-yellow-200 text-lg">
													Ready for Check-In
												</p>
												<p className="text-sm text-yellow-600 dark:text-yellow-400">
													Student recognized successfully
												</p>
												<p className="text-sm text-yellow-600 dark:text-yellow-400">
													Attendance will be recorded when you check in
												</p>
											</div>
											<div className="text-right">
												<AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
											</div>
										</div>
									</div>
								);
							})()
						) : todayRecords && todayRecords.length > 0 ? (
							<div className="space-y-3">
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
									Today's Records ({todayRecords.length})
								</p>
								{todayRecords.map((record: any, index: number) => {
									const student = record.studentId;
									return (
										<div
											key={record._id || index}
											className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
											<div className="flex items-center gap-3">
												<Avatar
													src={student?.image}
													alt={`${student?.firstName} ${student?.lastName}`}
													size="medium"
												/>
												<div className="flex-1">
													<p className="font-medium text-green-800 dark:text-green-200">
														{student?.firstName} {student?.lastName}
													</p>
													<p className="text-sm text-green-600 dark:text-green-400">
														{student?.section}
														{student?.strand
															? ` - ${student?.strand}`
															: ""}
													</p>
													<p className="text-xs text-green-500 dark:text-green-500">
														{format(
															new Date(record.checkInTime),
															"h:mm aa",
														)}{" "}
														- {record.attendanceStatus}
													</p>
												</div>
												<div className="text-right">
													<UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-center py-8 text-gray-500 dark:text-gray-400">
								<UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
								<p>No student recognized yet.</p>
								<p className="text-sm">Use the camera to recognize your face</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default StudentAttendance;
