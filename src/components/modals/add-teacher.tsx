import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import InputWithToggle from "../ui/input-toggle";
import { useQueryClient } from "@tanstack/react-query";

const teacherSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
	role: z.enum(["admin", "teacher"]),
	personId: z.string().optional(),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

export const AddTeacherModal = () => {
	const { register } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();

	const form = useForm<TeacherFormData>({
		resolver: zodResolver(teacherSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			role: "teacher",
			personId: "",
		},
	});

	const onSubmit = async (data: TeacherFormData) => {
		setLoading(true);
		try {
			await register(data);
			await queryClient.invalidateQueries({ queryKey: ["users"] }); // ✅ auto-refresh
			toast.success("Teacher account created successfully.");
			form.reset();
			setIsModalOpen(false);
		} catch (err) {
			toast.error("Failed to create account. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center gap-2">
					<UserPlus className="h-4 w-4" />
					Add Teacher
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<UserPlus className="h-5 w-5 text-blue-600" />
						Add Teacher Account
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<InputWithToggle placeholder="Enter password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-3 pt-4">
							<Button type="submit" className="flex-1" disabled={loading}>
								<UserPlus className="h-4 w-4 mr-2" />
								{loading ? "Creating..." : "Add Account"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									form.reset();
									setIsModalOpen(false);
								}}>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
