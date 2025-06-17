import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Check, UserCheck, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useAttendance } from "@/contexts/attendance-context";
import { toast } from "sonner";

const StudentAttendance = () => {
	const { state, markAttendance } = useAttendance();
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const [studentId, setStudentId] = useState("");
	const [recognizedStudent, setRecognizedStudent] = useState<any>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const today = new Date().toDateString();
	const todayAttendance = state.attendanceRecords.filter(
		(record) => new Date(record.timeIn).toDateString() === today,
	);

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
			toast.error("Unable to access camera. Please check your permissions.");
			setIsStreaming(false);
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

	const simulateFaceRecognition = useCallback(() => {
		if (!studentId.trim()) {
			toast.warning("Student ID is required.");
			return;
		}

		setIsProcessing(true);

		// Simulate face recognition processing time
		setTimeout(() => {
			const student = state.students.find(
				(s) =>
					s.studentId.toLowerCase() === studentId.toLowerCase() ||
					s.fullName.toLowerCase().includes(studentId.toLowerCase()),
			);

			if (student) {
				// Store face data in localStorage (simulating face recognition)
				const faceData = {
					studentId: student.id,
					timestamp: new Date().toISOString(),
					confidence: Math.random() * 0.3 + 0.7, // Simulate 70-100% confidence
				};

				const existingFaceData = JSON.parse(
					localStorage.getItem("face_recognition_data") || "[]",
				);
				existingFaceData.push(faceData);
				localStorage.setItem("face_recognition_data", JSON.stringify(existingFaceData));

				setRecognizedStudent(student);
				toast.success(`Face recognized: ${student.fullName}`);
			} else {
				toast.error("Student not found. Please check your ID or name.");
				setRecognizedStudent(null);
			}
			setIsProcessing(false);
		}, 2000);
	}, [studentId, state.students]);

	const markStudentAttendance = () => {
		if (!recognizedStudent) return;

		markAttendance(recognizedStudent.id);
		setRecognizedStudent(null);
		setStudentId("");
		stopCamera();
	};

	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, [stopCamera]);

	const getStudentTodayAttendance = (studentId: string) => {
		return todayAttendance.find((record) => record.studentId === studentId);
	};

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Student Attendance</h1>
				<p className="text-gray-600 mt-2">
					Use face recognition to mark your attendance -{" "}
					{format(new Date(), "EEEE, MMMM d, yyyy")}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Face Recognition Section */}
				<Card className="dark:bg-gray-800 dark:text-white">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Camera className="h-5 w-5" />
							Face Recognition Check-in
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Student ID Input */}
						<div className="space-y-2">
							<Label htmlFor="studentId">Student ID or Name</Label>
							<Input
								id="studentId"
								type="text"
								value={studentId}
								onChange={(e) => setStudentId(e.target.value)}
								placeholder="Enter your student ID or name"
								disabled={isProcessing}
							/>
						</div>

						{/* Camera Feed */}
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
									<div className="bg-white rounded-lg p-4 flex items-center gap-2">
										<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
										<span>Recognizing face...</span>
									</div>
								</div>
							)}

							{/* Face overlay guide */}
							<div className="absolute inset-0 pointer-events-none">
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-white border-dashed rounded-lg"></div>
							</div>
						</div>

						{/* Recognized Student Display */}
						{recognizedStudent && (
							<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
										<UserCheck className="h-6 w-6 text-green-600" />
									</div>
									<div>
										<h3 className="font-semibold text-green-800">
											{recognizedStudent.fullName}
										</h3>
										<p className="text-sm text-green-600">
											{recognizedStudent.section} - {recognizedStudent.strand}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Controls */}
						<div className="flex gap-3">
							{!isStreaming && !recognizedStudent && (
								<Button onClick={startCamera} className="flex items-center gap-2">
									<Camera className="h-4 w-4" />
									Start Camera
								</Button>
							)}

							{isStreaming && !recognizedStudent && (
								<Button
									onClick={simulateFaceRecognition}
									disabled={isProcessing || !studentId.trim()}
									className="flex items-center gap-2">
									<Camera className="h-4 w-4" />
									{isProcessing ? "Processing..." : "Recognize Face"}
								</Button>
							)}

							{recognizedStudent && (
								<Button
									onClick={markStudentAttendance}
									className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
									<Check className="h-4 w-4" />
									Mark Attendance
								</Button>
							)}

							{isStreaming && (
								<Button variant="outline" onClick={stopCamera}>
									Stop Camera
								</Button>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Today's Status */}
				<Card className="dark:bg-gray-800 dark:text-white">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Your Attendance Today
						</CardTitle>
					</CardHeader>
					<CardContent>
						{recognizedStudent ? (
							<div className="space-y-4">
								<div className="text-center">
									<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<span className="text-blue-600 font-bold text-lg">
											{recognizedStudent.fullName
												.split(" ")
												.map((n: string) => n[0])
												.join("")}
										</span>
									</div>
									<h3 className="font-semibold text-gray-900">
										{recognizedStudent.fullName}
									</h3>
									<p className="text-gray-600">{recognizedStudent.studentId}</p>
								</div>

								{(() => {
									const attendance = getStudentTodayAttendance(
										recognizedStudent.id,
									);
									if (attendance) {
										return (
											<div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
												<UserCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
												<p className="font-medium text-green-800">
													Already Checked In
												</p>
												<p className="text-sm text-green-600">
													Time In:{" "}
													{format(new Date(attendance.timeIn), "h:mm aa")}
												</p>
											</div>
										);
									} else {
										return (
											<div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
												<AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
												<p className="font-medium text-yellow-800">
													Not Checked In
												</p>
												<p className="text-sm text-yellow-600">
													Please mark your attendance above
												</p>
											</div>
										);
									}
								})()}
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
								<p>Enter your student ID and use face recognition</p>
								<p className="text-sm">to check your attendance status</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Recent Check-ins */}
			<Card className="dark:bg-gray-800 dark:text-white">
				<CardHeader>
					<CardTitle>Recent Check-ins Today ({todayAttendance.length})</CardTitle>
				</CardHeader>
				<CardContent>
					{todayAttendance.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
							<p>No check-ins recorded today</p>
						</div>
					) : (
						<div className="space-y-3">
							{todayAttendance
								.sort(
									(a, b) =>
										new Date(b.timeIn).getTime() - new Date(a.timeIn).getTime(),
								)
								.slice(0, 10)
								.map((record) => {
									const student = state.students.find(
										(s) => s.id === record.studentId,
									);
									if (!student) return null;

									return (
										<div
											key={record.id}
											className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div className="flex items-center space-x-3">
												<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
													<span className="text-blue-600 font-semibold text-sm">
														{student.fullName
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</span>
												</div>
												<div>
													<p className="font-medium text-gray-900">
														{student.fullName}
													</p>
													<p className="text-sm text-gray-500">
														{student.section}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium text-gray-900">
													{format(new Date(record.timeIn), "h:mm aa")}
												</p>
												<div className="flex items-center gap-1">
													<div className="w-2 h-2 bg-green-500 rounded-full"></div>
													<span className="text-xs text-green-600">
														Present
													</span>
												</div>
											</div>
										</div>
									);
								})}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default StudentAttendance;
