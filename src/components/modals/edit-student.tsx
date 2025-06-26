import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { StudentModel } from "@/models/student-model";
import { useStudent } from "@/hooks/use-student";
import { InputGroup } from "../features/input-group";
import { SelectGroup } from "../features/select-group";

interface EditStudentModalProps {
	open: boolean;
	onClose: () => void;
	student: StudentModel | null;
}

export const EditStudentModal = ({ open, onClose, student }: EditStudentModalProps) => {
	const { update } = useStudent();

	const [formData, setFormData] = useState<StudentModel | null>(null);

	useEffect(() => {
		if (student) {
			setFormData({ ...student });
		}
	}, [student]);

	const handleChange = (field: keyof StudentModel, value: string) => {
		if (!formData) return;
		setFormData({ ...formData, [field]: value });
	};

	const handleSave = async () => {
		if (!formData || !formData._id) return;

		try {
			await update.mutateAsync(formData);
			toast.success("Student updated successfully.");
			onClose();
		} catch (err) {
			toast.error("Failed to update student.");
			console.error(err);
		}
	};

	if (!formData) return null;

	return (
		<div className="">
			<Dialog open={open} onOpenChange={onClose}>
				<DialogContent className="min-w-3xl overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Edit Student</DialogTitle>
					</DialogHeader>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<InputGroup
							label="Student ID *"
							id="studentId"
							value={formData.studentId}
							onChange={handleChange}
						/>

						<InputGroup
							label="Section *"
							id="section"
							value={formData.section}
							onChange={handleChange}
						/>
						<div className="flex space-x-2">
							<InputGroup
								label="First Name *"
								id="firstName"
								value={formData.firstName}
								onChange={handleChange}
							/>
							<InputGroup
								label="Last Name *"
								id="lastName"
								value={formData.lastName}
								onChange={handleChange}
							/>
							<InputGroup
								label="Middle Name"
								id="middleName"
								value={formData.middleName || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="flex space-x-2">
							<SelectGroup
								label="Grade Level *"
								id="gradeLevel"
								value={formData.gradeLevel}
								options={["11", "12"]}
								onChange={handleChange}
							/>
							<SelectGroup
								label="Strand (Grades 11–12)"
								id="strand"
								value={formData.strand ?? ""}
								options={["STEM", "HUMSS", "ABM", "GAS", "TVL"]}
								onChange={handleChange}
								disabled={
									formData.gradeLevel !== "11" && formData.gradeLevel !== "12"
								}
							/>
						</div>
						<InputGroup
							label="Email Address"
							id="email"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>

					<div className="flex justify-end gap-2 mt-6">
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={handleSave}>Save Changes</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
