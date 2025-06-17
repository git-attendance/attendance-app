import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserServices } from "@/services/user-service";
import type { UserModel } from "@/models/user-model";

const userService = new UserServices();

// Top-level user fetching hook
export const useUsers = () => {
	return useQuery({
		queryKey: ["users"],
		queryFn: () => userService.getAll(),
	});
};

// Optional: Fetch a single user by ID
export const useUserById = (userId: string) => {
	return useQuery({
		queryKey: ["users", userId],
		queryFn: () => userService.get(userId),
		enabled: !!userId,
	});
};

// Mutations
export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, data }: { userId: string; data: UserModel }) =>
			userService.update(userId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => userService.delete(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};

export const useSearchUsers = () => {
	return useMutation({
		mutationFn: (params: any) => userService.search(params),
	});
};

export const useUploadUserAvatar = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, files }: { userId: string; files: File | File[] }) =>
			userService.uploadAvatar(userId, files),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});
};
