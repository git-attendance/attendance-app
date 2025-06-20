import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APP_CONSTANTS } from "@/configs/app-constants";
import { UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import InputWithToggle from "@/components/ui/input-toggle";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

const RegistrationForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "teacher",
	});
	const { register, isLoading } = useAuth();
	const navigate = useNavigate();
	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	const validate = () => {
		const errs: typeof errors = {};
		if (!formData.name.trim()) errs.name = "Name is required";
		if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
			errs.email = "Invalid email format";
		if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
		if (formData.password !== formData.confirmPassword)
			errs.confirmPassword = "Passwords do not match";
		if (!formData.role) errs.role = "Role is required";

		setErrors(errs);

		// Show all errors in a toast
		if (Object.keys(errs).length > 0) {
			Object.values(errs).forEach((msg) => toast.error(msg));
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) {
			toast.error("Please fix the errors before submitting.");
			return;
		}

		try {
			await register(formData);
			toast.success("Registration successful! Please log in.");
			navigate("/login");
		} catch (error) {
			console.error("Failed to register", error);
			toast.error("Registration failed. Please try again.");
		}
	};

	return (
		<div className="flex w-full min-h-screen items-center justify-center bg-sky-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<img className="size-30 mx-auto" src={APP_CONSTANTS.APP_LOGO} />
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
						Register for Attendance System
					</h2>
				</div>

				<form className="mt-8 space-y-6" onSubmit={() => {}} noValidate>
					<div className="space-y-4">
						{/* Name */}
						<div>
							<label htmlFor="name" className="sr-only">
								Name
							</label>
							<Input
								id="name"
								name="name"
								type="text"
								placeholder="Full Name"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, name: e.target.value }))
								}
								required
							/>
							{/* {errors.name && (
								<p className="text-sm text-red-500 mt-1">{errors.name}</p>
							)} */}
						</div>

						{/* Email */}
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Email address"
								value={formData.email}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, email: e.target.value }))
								}
								required
							/>
							{/* {errors.email && (
								<p className="text-sm text-red-500 mt-1">{errors.email}</p>
							)} */}
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<InputWithToggle
								name="password"
								placeholder="Password"
								value={formData.password}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
							/>
							{/* {errors.password && (
								<p className="text-sm text-red-500 mt-1">{errors.password}</p>
							)} */}
						</div>

						{/* Confirm Password */}
						<div>
							<label htmlFor="confirmPassword" className="sr-only">
								Confirm Password
							</label>
							<InputWithToggle
								name="confirmPassword"
								placeholder="Confirm Password"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										confirmPassword: e.target.value,
									}))
								}
							/>
							{/* {errors.confirmPassword && (
								<p className="text-sm text-red-500 mt-1">
									{errors.confirmPassword}
								</p>
							)} */}
						</div>
					</div>

					<Button
						type="submit"
						disabled={isLoading}
						onClick={handleSubmit}
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded-md shadow-sm px-4 py-2 flex items-center justify-center gap-2">
						<UserPlus className="h-5 w-5" />
						{!isLoading ? "Create Account" : "Registering..."}
					</Button>
				</form>

				<div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
						Sign in
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RegistrationForm;
