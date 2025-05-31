import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateEventButtonProps {
	onClick: () => void;
}

export const CreateEventButton = ({ onClick }: CreateEventButtonProps) => {
	return (
		<Button onClick={onClick} className="bg-blue-600 hover:bg-blue-700 text-white">
			<Plus className="w-4 h-4 mr-2" />
			Create Event
		</Button>
	);
};
