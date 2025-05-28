import { APP_CONSTANTS } from "@/configs/app-constants";
import { ERROR } from "@/configs/error-contants";
import { Link } from "react-router-dom";

type ErrorType = keyof typeof ERROR;

interface ErrorPageProps {
	type: ErrorType;
}

const Error = ({ type }: ErrorPageProps) => {
	const error = ERROR[type];

	return (
		<div className="flex flex-col md:flex-row min-h-screen items-center justify-center gap-10 bg-white text-primary dark:bg-gray-900 dark:text-gray-100">
			<section className="md:border-r-4">
				<img
					src={APP_CONSTANTS.APP_LOGO}
					alt={APP_CONSTANTS.APP_TITLE}
					className="size-52"
				/>
			</section>
			<section className="flex flex-col items-center gap-5">
				<h1 className="text-7xl font-bold">{error.title}</h1>
				<p className="text-3xl">{error.subTitle}</p>
				<p className="text-xl text-neutral text-center">{error.message}</p>
				{error.buttonAction ? (
					<button
						onClick={error.buttonAction}
						className={`rounded-lg ${error.bgColor} px-6 py-2 text-lg font-medium text-white transition ${error.hoverColor}`}>
						{error.buttonText}
					</button>
				) : (
					<Link
						to={error.buttonLink}
						className={`rounded-lg ${error.bgColor} px-6 py-2 text-lg font-medium text-white transition ${error.hoverColor}`}>
						{error.buttonText}
					</Link>
				)}
			</section>
		</div>
	);
};

export default Error;
