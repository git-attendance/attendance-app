export const extractErrorMessage = (err: unknown): string => {
	const error = err as any;
	return error?.response?.data?.error?.message || error?.message || "An unknown error occurred";
};
