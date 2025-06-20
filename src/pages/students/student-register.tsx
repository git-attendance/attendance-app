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
import { toast } from "sonner";
import FaceCapture from "@/components/features/register-face-capture";
import { useStudent } from "@/hooks/use-student";

const StudentRegister = () => {
	const { create } = useStudent();
	const [step, setStep] = useState<"form" | "capture">("form");

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		middleName: "",
		studentId: "",
		gradeLevel: "",
		section: "",
		strand: "",
		email: "",
		personId: "", // placeholder, might be updated post-face enrollment
	});

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const requiredFields = ["firstName", "lastName", "studentId", "gradeLevel", "section"];
		const missing = requiredFields.filter((field) => !formData[field as keyof typeof formData]);

		if (missing.length > 0) {
			toast.warning("Please fill in all required fields.");
			return;
		}
		try {
			await create.mutateAsync(formData);
			toast.success("Student registered successfully.");
			resetForm();
		} catch (err) {
			toast.error("Failed to register student.");
			console.error(err);
		}
		setStep("capture");
	};

	const handleFaceCapture = () => {
		toast.info("Face images capture is coming soon.");
	};

	const handleComplete = async () => {
		try {
			await create.mutateAsync(formData);
			toast.success("Student registered successfully.");
			resetForm();
		} catch (err) {
			toast.error("Failed to register student.");
			console.error(err);
		}
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
			personId: "",
		});
		setStep("form");
	};

	const goBack = () => {
		setStep("form");
	};

	if (step === "capture") {
		return (
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold">Face Registration</h1>
						<p className="text-muted-foreground mt-2">
							Capture face images for {formData.firstName} {formData.lastName}
						</p>
					</div>
					<Button variant="outline" onClick={goBack} className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to Form
					</Button>
				</div>

				<FaceCapture
					onCapture={handleFaceCapture}
					onComplete={handleComplete}
					studentName={`${formData.firstName} ${formData.lastName}`}
				/>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6 ">
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
								<Camera className="h-4 w-4" />
								Proceed to Face Capture
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{formData.firstName && (
				<Card className="mx-auto border-dashed border-2 border-blue-300 bg-blue-50 dark:bg-blue-900/10">
					<CardContent className="p-4">
						<h3 className="font-medium text-blue-900 mb-2">Student Preview</h3>
						<div className="text-sm text-blue-700 space-y-1">
							<p>
								<strong>Name:</strong> {formData.firstName} {formData.middleName}{" "}
								{formData.lastName}
							</p>
							<p>
								<strong>ID:</strong> {formData.studentId}
							</p>
							<p>
								<strong>Grade & Section:</strong> {formData.gradeLevel} -{" "}
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

// Reusable input component
const InputGroup = ({
	label,
	id,
	value,
	onChange,
}: {
	label: string;
	id: string;
	value: string;
	onChange: (field: string, value: string) => void;
}) => (
	<div className="space-y-2">
		<Label htmlFor={id}>{label}</Label>
		<Input
			id={id}
			value={value}
			onChange={(e) => onChange(id, e.target.value)}
			placeholder={`Enter ${label.toLowerCase()}`}
			required={label.includes("*")}
		/>
	</div>
);

const SelectGroup = ({
	label,
	id,
	value,
	options,
	onChange,
	disabled = false,
}: {
	label: string;
	id: string;
	value: string;
	options: string[];
	onChange: (field: string, value: string) => void;
	disabled?: boolean;
}) => (
	<div className="space-y-2">
		<Label htmlFor={id}>{label}</Label>
		<Select value={value} onValueChange={(val) => onChange(id, val)} disabled={disabled}>
			<SelectTrigger>
				<SelectValue placeholder={`Select ${label.toLowerCase()}`} />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option} value={option}>
						{option}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
);
