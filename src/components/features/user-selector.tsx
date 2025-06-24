import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUsers } from "@/hooks/use-user";
import { useAuth } from "@/contexts/auth-context";
import type { UserModel } from "@/models/user-model";

interface TeacherSelectorProps {
	value: string | null;
	onChange: (value: string | null) => void;
}

export const TeacherSelector = ({ value, onChange }: TeacherSelectorProps) => {
	const { user } = useAuth();
	const { data: allUsers = [], isLoading } = useUsers();

	if (user?.role !== "admin") return null;

	const teacherOptions = allUsers.filter(
		(u: UserModel) => u.role === "teacher" || u.role === "admin",
	);

	if (isLoading) {
		return (
			<Select value="all" disabled>
				<SelectTrigger className="w-[220px] h-9">
					<SelectValue placeholder="Loading..." />
				</SelectTrigger>
			</Select>
		);
	}

	return (
		<Select value={value ?? "all"} onValueChange={(val) => onChange(val || null)}>
			<SelectTrigger className="w-[220px] h-9">
				<SelectValue placeholder="Select organizer" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">Select organizer</SelectItem>
				{teacherOptions.map((teacher: UserModel) => (
					<SelectItem key={teacher._id} value={teacher._id}>
						{teacher.name || teacher.email}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
