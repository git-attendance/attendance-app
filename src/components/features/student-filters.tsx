import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface StudentFiltersProps {
	searchTerm: string;
	selectedGrade: string;
	selectedStrand: string;
	onSearchChange: (value: string) => void;
	onGradeChange: (value: string) => void;
	onStrandChange: (value: string) => void;
}

export const StudentFilters = ({
	searchTerm,
	selectedGrade,
	selectedStrand,
	onSearchChange,
	onGradeChange,
	onStrandChange,
}: StudentFiltersProps) => {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Search students by name, ID, or section..."
							value={searchTerm}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-10"
						/>
					</div>
					<select
						value={selectedGrade}
						onChange={(e) => onGradeChange(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
						<option value="all">All Grades</option>
						<option value="7">Grade 7</option>
						<option value="8">Grade 8</option>
						<option value="9">Grade 9</option>
						<option value="10">Grade 10</option>
						<option value="11">Grade 11</option>
						<option value="12">Grade 12</option>
					</select>
					<select
						value={selectedStrand}
						onChange={(e) => onStrandChange(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900">
						<option value="all">All Strands</option>
						<option value="STEM">STEM</option>
						<option value="HUMSS">HUMSS</option>
						<option value="ABM">ABM</option>
						<option value="GAS">GAS</option>
						<option value="TVL">TVL</option>
					</select>
				</div>
			</CardContent>
		</Card>
	);
};
