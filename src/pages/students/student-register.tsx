import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Camera, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import FaceCapture from "@/components/features/register-face-capture";
import { useStudent } from "@/hooks/use-student";
import { InputGroup } from "@/components/features/input-group";
import { SelectGroup } from "@/components/features/select-group";

const StudentRegister = () => {
	const { create } = useStudent();
	const [step, setStep] = useState<"form" | "guardian" | "capture" | "complete">("form");

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		middleName: "",
		studentId: "",
		gradeLevel: "",
		section: "",
		strand: "",
		email: "",
	});

	const [guardianData, setGuardianData] = useState({
		firstName: "",
		lastName: "",
		middleName: "",
		email: "",
		phoneNumber: "",
	});

	const [createdStudent, setCreatedStudent] = useState<null | { _id: string; fullName: string }>(
		null,
	);

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleGuardianChange = (field: string, value: string) => {
		setGuardianData((prev) => ({ ...prev, [field]: value }));
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const requiredFields = ["firstName", "lastName", "studentId", "gradeLevel", "section"];
		const missing = requiredFields.filter((field) => !formData[field as keyof typeof formData]);

		if (missing.length > 0) {
			toast.warning("Please fill in all required student fields.");
			return;
		}

		setStep("guardian");
	};

	const handleGuardianSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!guardianData.firstName || !guardianData.lastName || !guardianData.email) {
			toast.warning("Please complete required guardian fields.");
			return;
		}

		try {
			const payload = {
				...formData,
				guardian: guardianData,
				personId: "", // initial blank value
			};
			const { _id } = await create.mutateAsync(payload);
			setCreatedStudent({ _id, fullName: `${formData.firstName} ${formData.lastName}` });
			toast.success("Student and guardian info saved. Proceed to face capture.");
			setStep("capture");
		} catch (error) {
			console.error(error);
			toast.error("Failed to save student with guardian info.");
		}
	};

	const handleFaceCaptureSuccess = () => {
		setStep("complete");
	};

	const handleComplete = () => {
		resetForm();
		toast.success("Student registration complete.");
	};

	const resetForm = () => {
		setFormData({
			firstName: "",
			lastName: "",
			middleName: "",
			studentId: "",
			gradeLevel: "",
			section: "",
			strand: "",
			email: "",
		});
		setGuardianData({
			firstName: "",
			lastName: "",
			middleName: "",
			email: "",
			phoneNumber: "",
		});
		setCreatedStudent(null);
		setStep("form");
	};

	const goBack = () => {
		setStep("form");
	};

	if (step === "capture" && createdStudent) {
		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Face Registration</h1>
						<p className="text-muted-foreground mt-2">
							Capture face for {createdStudent.fullName}
						</p>
					</div>
					<Button variant="outline" onClick={goBack} className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Form
					</Button>
				</div>

				<FaceCapture
					onSuccess={handleFaceCaptureSuccess}
					studentName={createdStudent.fullName}
					studentId={createdStudent._id}
				/>
			</div>
		);
	}

	if (step === "complete" && createdStudent) {
		return (
			<div className="flex flex-col items-center justify-center space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Registration Complete</h1>
					<p className="text-muted-foreground mt-2">
						Student {createdStudent.fullName} has been registered successfully.
					</p>
				</div>

				<Button
					onClick={handleComplete}
					className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
					<Check className="h-4 w-4" />
					Complete Registration
				</Button>
			</div>
		);
	}

	if (step === "guardian") {
		return (
			<Card className="dark:bg-gray-800 bg-white shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">Guardian Information</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleGuardianSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputGroup
								label="First Name *"
								id="guardianFirstName"
								value={guardianData.firstName}
								onChange={(_, value) => handleGuardianChange("firstName", value)}
							/>
							<InputGroup
								label="Last Name *"
								id="guardianLastName"
								value={guardianData.lastName}
								onChange={(_, value) => handleGuardianChange("lastName", value)}
							/>
							<InputGroup
								label="Middle Name"
								id="guardianMiddleName"
								value={guardianData.middleName}
								onChange={(_, value) => handleGuardianChange("middleName", value)}
							/>
							<InputGroup
								label="Email Address *"
								id="guardianEmail"
								value={guardianData.email}
								onChange={(_, value) => handleGuardianChange("email", value)}
							/>
							<InputGroup
								label="Phone Number"
								id="guardianPhoneNumber"
								value={guardianData.phoneNumber}
								onChange={(_, value) => handleGuardianChange("phoneNumber", value)}
							/>
						</div>

						<div className="flex justify-between space-x-3 pt-4 border-t">
							<Button variant="outline" onClick={() => setStep("form")}>
								<ArrowLeft className="h-4 w-4" /> Back to Student Info
							</Button>
							<Button type="submit" className="flex items-center gap-2">
								<Camera className="h-4 w-4" />
								Proceed to Face Capture
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Register New Student</h1>
				<p className="text-muted-foreground mt-2">
					Add student information and capture face data for attendance tracking
				</p>
			</div>

			<Card className="dark:bg-gray-800 bg-white shadow-md">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<UserPlus className="h-5 w-5" />
						Student Information
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleFormSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InputGroup
								label="Student ID *"
								id="studentId"
								value={formData.studentId}
								onChange={handleInputChange}
							/>
							<InputGroup
								label="Section *"
								id="section"
								value={formData.section}
								onChange={handleInputChange}
							/>
							<div className="flex space-x-2">
								<InputGroup
									label="First Name *"
									id="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
								/>
								<InputGroup
									label="Last Name *"
									id="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
								/>
								<InputGroup
									label="Middle Name"
									id="middleName"
									value={formData.middleName}
									onChange={handleInputChange}
								/>
							</div>
							<div className="flex space-x-2">
								<SelectGroup
									label="Grade Level *"
									id="gradeLevel"
									value={formData.gradeLevel}
									options={["7", "8", "9", "10", "11", "12"]}
									onChange={handleInputChange}
								/>
								<SelectGroup
									label="Strand (Grades 11–12)"
									id="strand"
									value={formData.strand}
									options={["STEM", "HUMSS", "ABM", "GAS", "TVL"]}
									onChange={handleInputChange}
									disabled={
										formData.gradeLevel !== "11" && formData.gradeLevel !== "12"
									}
								/>
							</div>
							<InputGroup
								label="Email Address"
								id="email"
								value={formData.email}
								onChange={handleInputChange}
							/>
						</div>

						<div className="flex justify-end space-x-3 pt-4 border-t">
							<Button type="button" variant="outline" onClick={resetForm}>
								Clear Form
							</Button>
							<Button type="submit" className="flex items-center gap-2">
								<UserPlus className="h-4 w-4" />
								Next: Guardian Info
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default StudentRegister;
