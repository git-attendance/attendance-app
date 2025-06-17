// src/hooks/use-student.ts
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentService } from "@/services/student-service";
import type { StudentModel } from "@/models/student-model";

export const useStudent = () => {
	const queryClient = useQueryClient();

	const service = useMemo(() => new StudentService(), []);

	// Queries
	const getAll = () =>
		useQuery<StudentModel[]>({
			queryKey: ["students"],
			queryFn: () => service.getAll(),
		});

	const getById = (id: string) =>
		useQuery<StudentModel>({
			queryKey: ["students", id],
			queryFn: () => service.getById(id),
			enabled: !!id,
		});

	// Mutations
	const create = useMutation({
		mutationFn: (data: Partial<StudentModel>) => service.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<StudentModel> }) =>
			service.update(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
			queryClient.invalidateQueries({ queryKey: ["students", id] });
		},
	});

	const remove = useMutation({
		mutationFn: (id: string) => service.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["students"] });
		},
	});

	const search = useMutation({
		mutationFn: (query: Partial<StudentModel>) => service.search(query),
	});

	return {
		getAll,
		getById,
		create,
		update,
		remove,
		search,
	};
};
