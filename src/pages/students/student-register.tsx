import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UserPlus, Camera, ArrowLeft } from "lucide-react";
import { useAttendance } from "@/contexts/attendance-context";
import { toast } from "sonner";
import FaceCapture from "@/components/features/register-face-capture";

const StudentRegister = () => {
	const { addStudent } = useAttendance();
	const [step, setStep] = useState<"form" | "capture">("form");
	const [formData, setFormData] = useState({
		fullName: "",
		studentId: "",
		grade: "",
		section: "",
		strand: "",
		email: "",
	});
	const [capturedImages, setCapturedImages] = useState<string[]>([]);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.fullName || !formData.studentId || !formData.grade || !formData.section) {
			toast.warning("Missing Information, Please fill in all required fields.");
			return;
		}

		setStep("capture");
	};

	const handleFaceCapture = (images: string[]) => {
		setCapturedImages(images);
	};

	const handleComplete = () => {
		const studentData = {
			...formData,
			photoUrl: capturedImages[0], // Use first captured image as profile photo
			faceDescriptors: [], // In real implementation, this would contain processed face data
		};

		addStudent(studentData);

		// Reset form
		setFormData({
			fullName: "",
			studentId: "",
			grade: "",
			section: "",
			strand: "",
			email: "",
		});
		setCapturedImages([]);
		setStep("form");
	};

	const goBack = () => {
		setStep("form");
		setCapturedImages([]);
	};

	if (step === "capture") {
		return (
			<div className="space-y-6">
				<div className="flex items-center space-x-4">
					<Button variant="outline" onClick={goBack} className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Form
					</Button>
					<div>
						<h1 className="text-3xl font-bold">Face Registration</h1>
						<p className="text-gray-600 mt-2">
							Capture face images for {formData.fullName}
						</p>
					</div>
				</div>

				<FaceCapture
					onCapture={handleFaceCapture}
					onComplete={handleComplete}
					studentName={formData.fullName}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Register New Student</h1>
				<p className="text-gray-600 mt-2">
					Add student information and capture face data for attendance tracking
				</p>
			</div>

			<Card className="mx-auto dark:bg-gray-800">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UserPlus className="h-5 w-5" />
						Student Information
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleFormSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="fullName">Full Name *</Label>
								<Input
									id="fullName"
									value={formData.fullName}
									onChange={(e) => handleInputChange("fullName", e.target.value)}
									placeholder="Enter full name"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="studentId">Student ID *</Label>
								<Input
									id="studentId"
									value={formData.studentId}
									onChange={(e) => handleInputChange("studentId", e.target.value)}
									placeholder="Enter student ID"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="grade">Grade Level *</Label>
								<Select
									value={formData.grade}
									onValueChange={(value) => handleInputChange("grade", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select grade" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="7">Grade 7</SelectItem>
										<SelectItem value="8">Grade 8</SelectItem>
										<SelectItem value="9">Grade 9</SelectItem>
										<SelectItem value="10">Grade 10</SelectItem>
										<SelectItem value="11">Grade 11</SelectItem>
										<SelectItem value="12">Grade 12</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="section">Section *</Label>
								<Input
									id="section"
									value={formData.section}
									onChange={(e) => handleInputChange("section", e.target.value)}
									placeholder="e.g., PYTHAGORAS, EINSTEIN"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="strand">Strand (Grades 11-12)</Label>
								<Select
									value={formData.strand}
									onValueChange={(value) => handleInputChange("strand", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select strand" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="STEM">STEM</SelectItem>
										<SelectItem value="HUMSS">HUMSS</SelectItem>
										<SelectItem value="ABM">ABM</SelectItem>
										<SelectItem value="GAS">GAS</SelectItem>
										<SelectItem value="TVL">TVL</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									placeholder="student@email.com"
								/>
							</div>
						</div>

						<div className="flex justify-end space-x-3 pt-4 border-t">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setFormData({
										fullName: "",
										studentId: "",
										grade: "",
										section: "",
										strand: "",
										email: "",
									});
								}}>
								Clear Form
							</Button>
							<Button type="submit" className="flex items-center gap-2">
								<Camera className="h-4 w-4" />
								Proceed to Face Capture
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* Preview Card */}
			{formData.fullName && (
				<Card className=" mx-auto border-dashed border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/10">
					<CardContent className="p-4">
						<h3 className="font-medium text-blue-900 mb-2">Student Preview</h3>
						<div className="text-sm text-blue-700">
							<p>
								<strong>Name:</strong> {formData.fullName}
							</p>
							<p>
								<strong>ID:</strong> {formData.studentId}
							</p>
							<p>
								<strong>Grade & Section:</strong> {formData.grade} -{" "}
								{formData.section}
							</p>
							{formData.strand && (
								<p>
									<strong>Strand:</strong> {formData.strand}
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default StudentRegister;
