import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	confirmClassName?: string;
}

export const DeleteDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title = "Delete Item",
	description = "Are you sure you want to delete this item? This action cannot be undone.",
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	confirmClassName = "bg-red-600 hover:bg-red-700",
}: DeleteDialogProps) => {
	return (
		<AlertDialog open={isOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>{cancelLabel}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm} className={confirmClassName}>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
