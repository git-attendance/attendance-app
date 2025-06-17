export const isTokenExpired = (token: string): boolean => {
	try {
		const [, payload] = token.split(".");
		const decoded = JSON.parse(atob(payload));
		const exp = decoded.exp;
		const now = Math.floor(Date.now() / 1000);
		return exp < now;
	} catch (e) {
		console.error("Invalid token format:", e);
		return true;
	}
};
