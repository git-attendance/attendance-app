import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routes from "./routes";

const router = createBrowserRouter(Routes);

const Router = () => {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
};

export default Router;
