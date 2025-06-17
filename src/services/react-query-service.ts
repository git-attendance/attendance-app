import { useQuery, useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";

type QueryOptions<T> = {
	key: QueryKey;
	queryFn: () => Promise<T>;
	enabled?: boolean;
};

export function useBaseQuery<T>({ key, queryFn, enabled = true }: QueryOptions<T>) {
	return useQuery<T>({
		queryKey: key,
		queryFn,
		enabled,
	});
}

type MutationOptions<TData, TVariables> = {
	mutationFn: (data: TVariables) => Promise<TData>;
	onSuccess?: (data: TData) => void;
	onError?: (err: any) => void;
	invalidateKey?: QueryKey;
};

export function useBaseMutation<TData, TVariables>({
	mutationFn,
	onSuccess,
	onError,
	invalidateKey,
}: MutationOptions<TData, TVariables>) {
	const queryClient = useQueryClient();

	return useMutation<TData, any, TVariables>({
		mutationFn,
		onSuccess: (data) => {
			if (invalidateKey) queryClient.invalidateQueries({ queryKey: invalidateKey });
			onSuccess?.(data);
		},
		onError,
	});
}
