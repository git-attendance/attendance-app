import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import SplashScreen from "@/layouts/splash-screen";
import { useAuth } from "@/hooks/use-auth";
import { RBAC_PAGE_ACCESS_MAP } from "@/configs/rbac-map";

const ProtectedRoute = () => {
	const { isAuthenticated, isLoading, user } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const currentPage = location.pathname;

	const role = user?.role;
	const allowedPages = RBAC_PAGE_ACCESS_MAP[role] || [];

	const hasAccess = allowedPages.some((p) =>
		new RegExp(`^${p.replace(/\*/g, ".*").replace(/:\w+/g, "[^/]+")}$`).test(currentPage),
	);

	useEffect(() => {
		if (isLoading) return;
		// If not authenticated, redirect to login
		if (!isAuthenticated) {
			navigate("/login", { replace: true, state: { from: location.pathname } });
			return;
		}
		// Root path → redirect to dashboard based on role
		if (currentPage === "/" && role) {
			navigate(`/${role}/dashboard`, { replace: true });
			return;
		}
		// If authenticated but no access to the page, redirect to login
		if (!hasAccess) {
			navigate("/login", { replace: true });
		}
	}, [isAuthenticated, isLoading, hasAccess, navigate]);

	if (isLoading) {
		return <SplashScreen />;
	}

	return <Outlet key={currentPage} />;
};

export default ProtectedRoute;
