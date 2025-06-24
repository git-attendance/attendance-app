import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { School, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { APP_CONSTANTS } from "@/configs/app-constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import InputWithToggle from "@/components/ui/input-toggle";

const Login = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [role, setRole] = useState<"admin" | "teacher">("teacher");
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
		role: role,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await login(credentials);
			toast.success("Login successful!");
			navigate(role === "admin" ? "/admin/dashboard" : "/teacher/dashboard");
		} catch (error) {
			console.error("Login failed", error);
			toast.error("Login failed. Please check your credentials.");
		}
	};

	return (
		<div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 via-white to-indigo-50 dark:from-blue-950 dark:via-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<img className="size-30 mx-auto" src={APP_CONSTANTS.APP_LOGO} />
					<h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
						School Attendance System
					</h2>
				</div>

				<div className="mt-8">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300 dark:border-gray-700" />
						</div>
						<div className="relative flex justify-center text-base text-blue-600 font-semibold">
							<span className="bg-gray-50 px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
								Login as
							</span>
						</div>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-3">
						<Button
							type="button"
							variant={"secondary"}
							className={`flex items-center justify-center rounded-md border focus:ring-2 focus:ring-blue-300 px-4 py-2 text-sm font-medium ${
								role === "admin"
									? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
									: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
							}`}
							onClick={() => {
								setRole("admin");
								setCredentials((prev) => ({ ...prev, role: "admin" }));
							}}>
							<User className="mr-2 h-5 w-5" />
							Admin
						</Button>
						<Button
							type="button"
							variant={"secondary"}
							className={`flex items-center justify-center rounded-md border focus:ring-2 focus:ring-blue-300 px-4 py-2 text-sm font-medium ${
								role === "teacher"
									? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400"
									: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
							}`}
							onClick={() => {
								setRole("teacher");
								setCredentials((prev) => ({ ...prev, role: "teacher" }));
							}}>
							<School className="mr-2 h-5 w-5" />
							Teacher
						</Button>
					</div>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="input w-full"
								placeholder="Email address"
								value={credentials.email}
								onChange={(e) =>
									setCredentials((prev) => ({ ...prev, email: e.target.value }))
								}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<InputWithToggle
								name="password"
								className="input w-full"
								placeholder="Password"
								value={credentials.password}
								onChange={(e) =>
									setCredentials((prev) => ({
										...prev,
										password: e.target.value,
									}))
								}
							/>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							{/* <Input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
								Remember me
							</label> */}
						</div>

						<div className="text-sm">
							<Link
								to="/forgot-password"
								className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
								Forgot your password?
							</Link>
						</div>
					</div>

					<div>
						<Button
							type="submit"
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold dark:bg-blue-500 dark:hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 rounded-md shadow-sm px-4 py-2">
							Sign in
						</Button>
					</div>
				</form>

				{/* <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
					Don't have an account?{" "}
					<Link
						to="/register"
						className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
						Sign up
					</Link>
				</div> */}
				{/* <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
					Demo Credentials:
					<br />
					Admin: admin@university.edu / adminuser123
					<br />
					Teacher: teacher@university.edu / teacheruser123
				</div> */}
			</div>
		</div>
	);
};

export default Login;
