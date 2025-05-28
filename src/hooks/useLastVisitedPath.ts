import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const EXCLUDED_PATHS = ["/login", "/register", "/forgot-password"];

export const useLastVisitedPath = () => {
	const location = useLocation();

	useEffect(() => {
		const fullPath = location.pathname + location.search + location.hash;

		if (!EXCLUDED_PATHS.some((path) => location.pathname.startsWith(path))) {
			localStorage.setItem("lastVisitedPath", fullPath);
		}
	}, [location.pathname, location.search, location.hash]);
};
