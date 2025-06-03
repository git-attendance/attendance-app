import { lazy, Suspense } from "react";
import useOnlineStatus from "./hooks/useOnlineStatus";
import SplashScreen from "./layouts/splash-screen";
import { ThemeProvider } from "./providers/theme-provider";
import Error from "./pages/error-page";
import { Toaster } from "./components/ui/sonner";
import { AttendanceProvider } from "./contexts/attendance-context";

function App() {
	const Router = lazy(() => import("./routes/router"));
	const isOnline = useOnlineStatus();

	if (!isOnline) {
		return <Error type="offline" />;
	}
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<AttendanceProvider>
				<Suspense fallback={<SplashScreen />}>
					<div className="min-h-screen h-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
						<Router />
					</div>
					<Toaster richColors />
				</Suspense>
			</AttendanceProvider>
		</ThemeProvider>
	);
}

export default App;
