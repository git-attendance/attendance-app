export const formatDate = (
	dateString: string | number | Date,
	format: "short" | "long" | "timeAgo" | "dd/mm/yyyy" = "short",
): string => {
	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		return "Invalid Date";
	}
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (format === "timeAgo") {
		if (diffInSeconds < 60) return "Just now";
		if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
		if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600);
			return `${hours} hr${hours > 1 ? "s" : ""} ago`;
		}
		if (diffInSeconds < 172800) return "Yesterday";
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
	}

	if (format === "long") {
		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: true,
		});
	}

	if (format === "dd/mm/yyyy") {
		return date
			.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			})
			.replace(/\//g, "/");
	}

	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};
