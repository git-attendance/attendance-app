import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface InputGroupProps<T extends string = string> {
	id: T;
	label: string;
	value: string;
	onChange: (field: T, value: string) => void;
}

export const InputGroup = <T extends string = string>({
	id,
	label,
	value,
	onChange,
}: InputGroupProps<T>) => (
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
