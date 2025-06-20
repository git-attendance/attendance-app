import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";

type InputWithToggleProps = {
	label?: string;
	placeholder?: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
};

export default function InputWithToggle({
	label,
	placeholder,
	name,
	value,
	onChange,
	className = "",
}: InputWithToggleProps) {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div className={`relative w-full ${className}`}>
			{label && (
				<label className="block mb-1 text-sm font-semibold text-gray-700">{label}</label>
			)}
			<div className="relative">
				<Input
					type={isVisible ? "text" : "password"}
					name={name}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					required
				/>
				<button
					type="button"
					onClick={() => setIsVisible(!isVisible)}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
					aria-label={isVisible ? "Hide content" : "Show content"}>
					{!isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
				</button>
			</div>
		</div>
	);
}
