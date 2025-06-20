import type { StudentModel } from "@/models/student-model";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export const InputGroup = ({
	id,
	label,
	value,
	onChange,
}: {
	id: keyof StudentModel;
	label: string;
	value: string;
	onChange: (field: keyof StudentModel, value: string) => void;
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
