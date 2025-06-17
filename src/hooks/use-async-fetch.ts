type TAsyncFetch = {
	get: typeof fetch;
	post: typeof fetch;
	put: typeof fetch;
	patch: typeof fetch;
	delete: typeof fetch;
};

const methods = ["get", "post", "put", "patch", "delete"];

export const useAsyncFetch = (): TAsyncFetch => {
	return methods.reduce((acc, method) => {
		return {
			...acc,
			[method]: async (url: string, init?: RequestInit) => {
				// Fetch token dynamically before each request
				const auth = localStorage.getItem("auth");
				const authData = auth ? JSON.parse(auth) : null;
				const token = authData?.token || null;

				const headers: Record<string, string> = {
					"Content-Type": "application/json",
					...(init?.headers as Record<string, string>),
				};

				if (token) {
					headers["Authorization"] = `Bearer ${token}`;
				}

				return fetch(url, {
					...init,
					method: method.toUpperCase(),
					headers,
				});
			},
		};
	}, {} as TAsyncFetch);
};
