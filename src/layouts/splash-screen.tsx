import { APP_CONSTANTS } from "@/configs/app-constants";

const SplashScreen = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen ">
			<img src={APP_CONSTANTS.APP_LOGO} alt="App Logo" className="w-52 h-52 animate-pulse" />
			<div className="mt-4 w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
		</div>
	);
};

export default SplashScreen;
