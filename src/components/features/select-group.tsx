import type { StudentModel } from "@/models/student-model";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const SelectGroup = ({
	id,
	label,
	value,
	options,
	onChange,
	disabled = false,
}: {
	id: keyof StudentModel;
	label: string;
	value: string;
	options: string[];
	onChange: (field: keyof StudentModel, value: string) => void;
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
