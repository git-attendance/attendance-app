import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APP_CONSTANTS } from "@/configs/app-constants";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	// const [errors, setErrors] = useState<{ [key: string]: string }>({});
	// const [submitting, setSubmitting] = useState(false);

	// const validate = () => {
	// 	const errs: typeof errors = {};
	// 	if (!formData.name.trim()) errs.name = "Name is required";
	// 	if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
	// 		errs.email = "Invalid email format";
	// 	if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
	// 	if (formData.password !== formData.confirmPassword)
	// 		errs.confirmPassword = "Passwords do not match";

	// 	setErrors(errs);
	// 	return Object.keys(errs).length === 0;
	// };

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	if (!validate()) return;
	// 	setSubmitting(true);
	// 	try {
	// 		const user = await authService.register({
	// 			name: formData.name,
	// 			email: formData.email,
	// 			password: formData.password,
	// 			role: "student",
	// 		});
	// 		if (user) {
	// 			authService.setCurrentUser(user);
	// 			navigate("/student/dashboard", { replace: true });
	// 		}
	// 	} catch (err: any) {
	// 		setErrors({ email: err?.message || "Registration failed" });
	// 	} finally {
	// 		setSubmitting(false);
	// 	}
	// };

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
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								value={formData.password}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
								required
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
							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="Confirm Password"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										confirmPassword: e.target.value,
									}))
								}
								required
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
						disabled={false} // Replace with submitting state
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded-md shadow-sm px-4 py-2 flex items-center justify-center gap-2">
						<UserPlus className="h-5 w-5" />
						{/* {!submitting ? "Create Account" : "Registering..."} */}
						Create Account
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
