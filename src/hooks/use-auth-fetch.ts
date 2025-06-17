type AuthFetchProps = {
	get: (url: string, init?: RequestInit) => Promise<any>;
	post: (url: string, init?: RequestInit) => Promise<any>;
	put: (url: string, init?: RequestInit) => Promise<any>;
	patch: (url: string, init?: RequestInit) => Promise<any>;
	delete: (url: string, init?: RequestInit) => Promise<any>;
};

export const useAuthFetch = (): AuthFetchProps => {
	const methods = ["get", "post", "put", "patch", "delete"] as const;

	const userFetch = methods.reduce((acc, method) => {
		return {
			...acc,
			[method]: async (url: string, init: RequestInit = {}) => {
				const auth = localStorage.getItem("auth");
				const authData = auth ? JSON.parse(auth) : null;

				const headers = authData
					? {
							Authorization: `Bearer ${authData.token}`,
							...init.headers,
						}
					: {
							...init.headers,
						};

				const response = await fetch(url, {
					...init,
					method: method.toUpperCase(),
					headers,
				});

				if (!response.ok) {
					let errorBody = null;
					try {
						errorBody = await response.json();
					} catch (_) {
						errorBody = { message: "Unknown error" };
					}
					throw {
						status: response.status,
						response: errorBody,
					};
				}

				// Handle no-content response (e.g. DELETE 204)
				if (response.status === 204) {
					return {
						success: true,
						message: "Operation successful",
						status: 204,
					};
				}

				const data = await response.json();
				return data?.data ?? data;
			},
		};
	}, {} as AuthFetchProps);

	return userFetch;
};
