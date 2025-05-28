import { type RouteObject } from "react-router-dom";
import { routesConfig } from "@/configs/routes-config";
import MainLayout from "@/layouts/main-layout";
import ProtectedRoute from "./protected-route";
import AuthLayout from "@/layouts/auth-layout";
import Error from "@/pages/error-page";

const Routes: RouteObject[] = [
	{
		element: <ProtectedRoute />,
		children: [
			{
				element: <MainLayout />,
				children: routesConfig.MAIN,
			},
		],
	},
	{
		element: <AuthLayout />,
		children: [...routesConfig.AUTH],
	},

	{
		path: "*",
		element: <Error type="404" />,
	},
	{
		path: "/forbidden",
		element: <Error type="403" />,
	},
];

export default Routes;
