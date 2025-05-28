import { useState } from "react";

import { MdLockOutline, MdOutlineMailOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";
// import { checkEmailPattern, validateFields } from "@/components/utils/common";
import { APP_CONSTANTS } from "@/configs/app-constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/contexts/ToastContext";

const LoginForm = () => {
	// const { login, loginWithProvider } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	// const navigate = useNavigate();

	// const location = useLocation();
	// const from = (location.state as any)?.from || localStorage.getItem("lastVisitedPath") || "/";

	const handleLogin = async () => {
		setIsLoading(true);

		// const requiredFields = {
		// 	email,
		// 	password,
		// };

		// if (!validateFields(requiredFields, showToast, setIsLoading)) {
		// 	return;
		// }

		// if (!checkEmailPattern(email, showToast, setIsLoading)) {
		// 	return;
		// }

		// try {
		// 	await login({ email, password });
		// 	navigate(from, { replace: true });
		// } catch (error) {
		// 	console.error("failed to login", error);
		// 	showToast(
		// 		"Account not recognized",
		// 		"Invalid email or password",
		// 		"error",
		// 		"top-10 right-5",
		// 	);
		// } finally {
		// 	setIsLoading(false);
		// }
	};

	// const handleComingSoon = (platform: string) => {
	// 	showToast(
	// 		`${platform} Login Coming Soon`,
	// 		`The ${platform} login feature is coming soon!`,
	// 		"info",
	// 		"top-10 right-5",
	// 	);
	// };

	// const handleProviderLogin = (provider: string) => {
	// 	loginWithProvider(provider);
	// };

	return (
		<div className="2xl:h-screen w-full flex flex-col items-center justify-center 2xl:gap-5 ">
			<section className="">
				<img
					src={APP_CONSTANTS.APP_LOGO}
					alt={APP_CONSTANTS.APP_TITLE}
					className="size-40 xl:size-52"
				/>
				<h1 className="text-primary font-bold text-xl text-center mb-5">
					{APP_CONSTANTS.MEMBER_LOGIN}
				</h1>
			</section>

			{/* <section className="w-[85%] md:w-[50%] flex flex-col gap-3">
				<Button
					variant="light"
					className="w-full rounded-xl border border-danger text-danger hover:bg-danger hover:text-white"
					onClick={() => handleProviderLogin("google")}
					aria-label={APP_CONSTANTS.CONTINUE_WITH_GOOGLE}>
					<p className="flex items-center justify-center gap-3">
						<FaGoogle /> {APP_CONSTANTS.CONTINUE_WITH_GOOGLE}
					</p>
				</Button>
				<Button
					variant="light"
					className="w-full mx-auto rounded-xl border border-info text-info hover:bg-info hover:text-white"
					onClick={() => handleComingSoon("Facebook")}
					aria-label={APP_CONSTANTS.CONTINUE_WITH_FACEBOOK}>
					<p className="flex items-center justify-center gap-3">
						<FaFacebook /> {APP_CONSTANTS.CONTINUE_WITH_FACEBOOK}
					</p>
				</Button>

				<div className="flex items-center justify-center my-2 2xl:my-5">
					<hr className="flex-grow border-t border-gray-400" />
					<p className="mx-4 text-center">{APP_CONSTANTS.OR_LOGIN_WITH}</p>
					<hr className="flex-grow border-t border-gray-400" />
				</div>
			</section> */}

			<section className="md:w-[50%] flex flex-col gap-3 ">
				<form onSubmit={(e) => e.preventDefault()} className="space-y-5">
					<div className="flex items-center justify-center gap-3 px-5 bg-gray-50 rounded-2xl">
						<MdOutlineMailOutline className="size-5" />
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={APP_CONSTANTS.ENTER_EMAIL}
							className="bg-transparent border-0 focus:outline-0 focus:ring-0"
						/>
					</div>

					<div className="flex items-center justify-center gap-3 px-5 bg-gray-50 rounded-xl">
						<MdLockOutline className="size-5" />
						<Input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder={APP_CONSTANTS.ENTER_PASSWORD}
							className="bg-transparent border-0 focus:outline-0 focus:ring-0"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
							className="text-primary"
							aria-label="Toggle password visibility">
							{showPassword ? (
								<MdVisibilityOff className="size-7" />
							) : (
								<MdVisibility className="size-7" />
							)}
						</button>
					</div>

					<div>
						<Link to="/forgot-password" className="text-primary">
							{APP_CONSTANTS.FORGOT_PASSWORD}
						</Link>
					</div>

					<Button
						type="submit"
						variant="default"
						onClick={handleLogin}
						className="w-full bg-black/80 text-white hover:bg-black/90 rounded-2xl"
						disabled={isLoading}
						aria-label={isLoading ? APP_CONSTANTS.PLEASE_WAIT : APP_CONSTANTS.CONTINUE}>
						{isLoading ? APP_CONSTANTS.PLEASE_WAIT : APP_CONSTANTS.CONTINUE}
					</Button>

					<p className="text-center">
						{APP_CONSTANTS.DONT_HAVE_AN_ACCOUNT}{" "}
						<span className="font-bold text-primary">
							<Link to="/register">{APP_CONSTANTS.SIGN_UP}</Link>
						</span>
					</p>
				</form>
			</section>
		</div>
	);
};

export default LoginForm;
