import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUpdateUser } from "@/hooks/use-user";
import { Shield } from "lucide-react";
import type { UserModel } from "@/models/user-model";

const editUserSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	role: z.enum(["admin", "teacher"]),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
	user: UserModel | null;
	open: boolean;
	onClose: () => void;
}

export const EditUserModal = ({ user, open, onClose }: EditUserModalProps) => {
	const form = useForm<EditUserFormData>({
		resolver: zodResolver(editUserSchema),
		defaultValues: {
			name: "",
			email: "",
			role: "teacher",
		},
	});

	const updateUser = useUpdateUser();

	useEffect(() => {
		if (user) {
			form.reset({
				name: user.name,
				email: user.email,
				role: user.role,
			});
		}
	}, [user]);

	const onSubmit = async (data: EditUserFormData) => {
		if (!user) return;

		try {
			await updateUser.mutateAsync({ userId: user._id, data: { ...user, ...data } });
			toast.success("User updated successfully.");
			onClose();
		} catch (err) {
			toast.error("Failed to update user.");
			console.error(err);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-blue-600" />
						Edit User Account
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter full name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Enter email address"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select role" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="admin">Admin</SelectItem>
											<SelectItem value="teacher">Teacher</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-3 pt-4">
							<Button type="submit" className="flex-1">
								Save Changes
							</Button>
							<Button type="button" variant="outline" onClick={onClose}>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
