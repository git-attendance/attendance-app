import { useLocation } from "react-router-dom";
import SHS_BUILDING from "@/assets/shs-building.jpg";
import { useState } from "react";
import { APP_CONSTANTS } from "@/configs/app-constants";
import Login from "@/components/features/auth/login";

const AuthPage = () => {
	const location = useLocation();
	const isLoginPage = location.pathname === "/login";
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<>
			<div className="flex h-screen w-full md:overflow-hidden">
				{isLoginPage ? (
					<>
						<section className="min-w-[40%] relative hidden md:block">
							<div
								className="absolute inset-0 bg-gray-200 animate-pulse"
								style={{ display: imageLoaded ? "none" : "block" }}
							/>
							<img
								src={SHS_BUILDING}
								alt="School Image"
								className={`size-full object-cover transition-opacity duration-500 ${
									imageLoaded ? "opacity-100" : "opacity-0"
								}`}
								onLoad={() => setImageLoaded(true)}
								loading="eager"
							/>
							<div className="absolute bottom-0 left-0 w-full h-80 flex items-end justify-center bg-gradient-to-t from-blue-950 to-transparent p-4 pb-10">
								<p className="text-white text-4xl font-semibold whitespace-pre-wrap font-serif">
									{APP_CONSTANTS.LOGIN_PAGE_TAGLINE.split("br-point").map(
										(part, index) => (
											<span key={index}>
												{part}
												{index !==
													APP_CONSTANTS.LOGIN_PAGE_TAGLINE.split(
														"br-point",
													).length -
														1 && <br />}
											</span>
										),
									)}
								</p>
							</div>
						</section>
						<Login />
					</>
				) : (
					<>
						{/* <RegistrationForm /> */}
						<section className="w-[70%] h-full hidden md:block">
							<div
								className="absolute inset-0 bg-gray-200 animate-pulse"
								style={{ display: imageLoaded ? "none" : "block" }}
							/>
							<img
								src={SHS_BUILDING}
								alt="Scenic image"
								className={`h-full w-full object-cover transition-opacity duration-500 ${
									imageLoaded ? "opacity-100" : "opacity-0"
								}`}
								onLoad={() => setImageLoaded(true)}
								loading="eager"
							/>
						</section>
					</>
				)}
			</div>
		</>
	);
};

export default AuthPage;
