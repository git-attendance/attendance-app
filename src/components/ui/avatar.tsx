import { useState } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface AvatarProps {
	src?: string;
	alt: string;
	size?: "small" | "medium" | "large";
	className?: string;
}

const Avatar = ({ src, alt = "Unknown User", size = "medium", className }: AvatarProps) => {
	const [hasError, setHasError] = useState(false);

	const sizeClasses = clsx({
		"size-10 text-sm": size === "small",
		"size-28 text-xl": size === "medium",
		"size-44 text-3xl": size === "large",
	});

	const initials =
		alt
			.split(" ")
			.map((word) => word[0] || "")
			.join("")
			.toUpperCase() || "?";

	return hasError || !src ? (
		<div
			className={twMerge(
				"rounded-full flex items-center justify-center bg-primary-mild   border-4 border-gray-100 dark:border-gray-800",
				"font-semibold",
				sizeClasses,
				className,
			)}>
			{initials}
		</div>
	) : (
		<img
			src={src}
			alt={alt}
			className={twMerge(
				"rounded-full  bg-white border-4 border-gray-100 object-cover",
				className,
				sizeClasses,
			)}
			onError={() => setHasError(true)}
		/>
	);
};

export default Avatar;
