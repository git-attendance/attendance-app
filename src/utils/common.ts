/**
 * Formats a number into a currency string.
 * @param amount - The number to format
 * @param currency - The currency code (e.g., 'USD', 'PHP', etc.)
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns The formatted currency string
 */
export const formatCurrency = (
	amount: number,
	currency: string = "USD",
	locale: string = "en-US",
): string => {
	return new Intl.NumberFormat(locale, {
		style: "currency",
		currency,
	}).format(amount);
};

/**
 * Formats a date into a human-readable string.
 * @param date - The date to format (can be a Date object or a string)
 * @param locale - The locale for formatting (default: 'en-US')
 * @param options - Additional options for formatting (optional)
 * @returns The formatted date string
 *
 */
export const formatDate = (
	date: Date | string,
	locale: string = "en-US",
	options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	},
): string => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Validates an email address format.
 * @param email - The email address to validate
 * @param showToast - Function to show a toast message with title, message, type, and position
 * @param setIsLoading - Optional function to set the loading state (default: undefined)
 * @returns `true` if the email is valid, otherwise `false`
 */
export const checkEmailPattern = (
	email: string,
	showToast: (
		title: string,
		message: string,
		type: "success" | "error" | "warning" | "info",
		position: string,
	) => void,
	setIsLoading?: (loading: boolean) => void,
): boolean => {
	if (!/\S+@\S+\.\S+/.test(email)) {
		setIsLoading?.(false);
		showToast("Input Error", "Please enter a valid email address", "error", "top-10 right-5");
		return false;
	}
	return true;
};

/**
 * Validates if all required fields are filled.
 * @param fields - An object with key-value pairs representing field names and their respective values
 * @param showToast - Function to show a toast message with title, message, type, and position
 * @param setIsLoading - Optional function to set the loading state (default: undefined)
 * @returns `true` if all fields are filled, otherwise `false`
 */
export const validateFields = (
	fields: Record<string, string>,
	showToast: (
		title: string,
		message: string,
		type: "success" | "error" | "warning" | "info",
		position: string,
	) => void,
	setIsLoading?: (loading: boolean) => void,
): boolean => {
	for (const [field, value] of Object.entries(fields)) {
		if (!value.trim()) {
			setIsLoading?.(false);
			showToast("Input Error", `Please fill in ${field}`, "error", "top-10 right-5");
			return false;
		}
	}

	return true;
};

/**
 * Validates if the password meets the required length.
 * @param password - The password string to be validated.
 * @param requiredLength - The minimum length the password should have.
 * @param showToast - Function to show a toast message with title, message, type, and position.
 * @param setIsLoading - Optional function to set the loading state (default: undefined).
 * @returns `true` if the password meets the required length, otherwise `false`.
 *
 * This function checks if the provided password is at least as long as the specified `requiredLength`.
 * If not, it will display an error message using the `showToast` function and set the loading state to `false` using `setIsLoading`.
 */
export const checkPasswordLength = (
	password: string,
	requiredLength: number,
	showToast: (
		title: string,
		message: string,
		type: "success" | "error" | "warning" | "info",
		position: string,
	) => void,
	setIsLoading?: (loading: boolean) => void,
): boolean => {
	if (password.length < requiredLength) {
		setIsLoading?.(false);
		showToast(
			"Input Error",
			`Password must be at least ${requiredLength} characters long`,
			"error",
			"top-10 right-5",
		);
		return false;
	}
	return true;
};

/**
 * Converts a string to title case.
 * @param text - The text to convert
 * @returns The text in title case
 */

export const toTitleCase = (text: string): string => {
	return text
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const getTimeDifference = (dateString: string): string => {
	const commentDate = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return "Just now";
	} else if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	} else if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	} else if (diffInSeconds < 2592000) {
		const days = Math.floor(diffInSeconds / 86400);
		return `${days} day${days > 1 ? "s" : ""} ago`;
	} else {
		// If the comment is older than 30 days, show the date
		return commentDate.toLocaleDateString("en-PH", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
};

export const convertTo12Hour = (time: string): string => {
	const [hours, minutes] = time.split(":").map(Number);
	const suffix = hours >= 12 ? "PM" : "AM";
	const formattedHours = ((hours + 11) % 12) + 1; // Convert 0-23 to 1-12
	return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};

export const convertTo24Hour = (time: string): string => {
	const [timePart, suffix] = time.split(" ");
	const [hours, minutes] = timePart.split(":").map(Number);
	const isPM = suffix === "PM";
	const formattedHours = isPM ? (hours % 12) + 12 : hours % 12;
	return `${formattedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

export const formatNumber = (
	num: number,
	options?: Intl.NumberFormatOptions & { useNotation?: boolean },
): string => {
	if (isNaN(num)) return "0";

	const { useNotation = true, ...formatOptions } = options || {};

	return new Intl.NumberFormat("en-US", {
		notation: useNotation ? "compact" : "standard",
		maximumFractionDigits: 2,
		...formatOptions,
	}).format(num);
};

export const removeEmojis = (str: any) => {
	return str.replace(/[\p{Emoji}\p{Extended_Pictographic}]/gu, "");
};

export const renderValue = (value: any) => {
	if (Array.isArray(value)) {
		return value.join(", ");
	}
	return value || "-";
};

export const decodeHtml = (str: string): string => {
	return str.replace(/&(amp|lt|gt|#x27|quot|#x2F);/g, (match) => {
		const entityMap: Record<string, string> = {
			"&amp;": "&",
			"&lt;": "<",
			"&gt;": ">",
			"&#x27;": "'",
			"&quot;": '"',
			"&#x2F;": "/",
		};
		return entityMap[match] || match;
	});
};

export const deepDecodeHtml = <T>(obj: T): T => {
	if (typeof obj === "string") {
		return decodeHtml(obj) as unknown as T;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => deepDecodeHtml(item)) as unknown as T;
	}

	if (typeof obj === "object" && obj !== null) {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => [key, deepDecodeHtml(value)]),
		) as T;
	}

	return obj;
};

export const formatTime = (time: string): string => {
	const [hours, minutes] = time.split(":").map(Number);
	if (isNaN(hours) || isNaN(minutes)) return "Invalid time";

	const formattedHours = hours % 12 || 12; // Convert 0-23 to 1-12
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const suffix = hours >= 12 ? "PM" : "AM";

	return `${formattedHours}:${formattedMinutes} ${suffix}`;
};
