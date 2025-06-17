import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubjectModel } from "@/models/subject-model";
import { SubjectService } from "@/services/subject-service";
import { toast } from "sonner";

const subjectService = new SubjectService();

type CreateSubjectPayload = {
	code: string;
	name: string;
	description: string;
	schedule: {
		day: string;
		startTime: string;
		endTime: string;
		room: string;
	};
	semester: string;
	instructor: string;
};

const subjectKeys = {
	all: ["subjects"],
	byId: (id: string) => ["subjects", id],
	byUser: (id: string) => ["subjects", "user", id],
	byInstructor: (id: string) => ["subjects", "instructor", id],
	bySemester: (id: string) => ["subjects", "semester", id],
};

export const useSubjects = () =>
	useQuery({
		queryKey: subjectKeys.all,
		queryFn: () => subjectService.getAll(),
	});

export const useSubject = (id: string) =>
	useQuery({
		queryKey: subjectKeys.byId(id),
		queryFn: () => subjectService.getById(id),
		enabled: !!id,
	});

export const useSubjectsByUser = (userId: string) =>
	useQuery({
		queryKey: subjectKeys.byUser(userId),
		queryFn: () => subjectService.getByUserId(userId),
		enabled: !!userId,
	});

export const useSubjectsByInstructor = (instructorId: string) =>
	useQuery({
		queryKey: subjectKeys.byInstructor(instructorId),
		queryFn: () => subjectService.getByInstructor(instructorId),
		enabled: !!instructorId,
	});

export const useSubjectsBySemester = (semester: string) =>
	useQuery({
		queryKey: subjectKeys.bySemester(semester),
		queryFn: () => subjectService.getBySemester(semester),
		enabled: !!semester,
	});

export const useCreateSubject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateSubjectPayload) => subjectService.create(data),
		onMutate: async (newSubject) => {
			await queryClient.cancelQueries({ queryKey: subjectKeys.all });
			const previousSubjects = queryClient.getQueryData<SubjectModel[]>(subjectKeys.all);

			queryClient.setQueryData(subjectKeys.all, (old: any) => [...(old || []), newSubject]);

			return { previousSubjects };
		},
		onError: (err: any, _newSubject, context) => {
			toast.error(err?.response?.data?.error?.message || "Failed to create subject.");
			if (context?.previousSubjects) {
				queryClient.setQueryData(subjectKeys.all, context.previousSubjects);
			}
		},
		onSuccess: (res: any) => {
			toast.success(res?.message || "Subject created successfully");
			queryClient.invalidateQueries({ queryKey: subjectKeys.all });
		},
	});
};

export const useUpdateSubject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<SubjectModel> }) =>
			subjectService.update(id, data),
		onSuccess: (_data, variables, _context) => {
			toast.success("Subject updated successfully");
			queryClient.invalidateQueries({ queryKey: subjectKeys.byId(variables.id) });
		},
		onError: (err: any) => {
			toast.error(err?.response?.data?.error?.message || "Failed to update subject.");
		},
	});
};

export const useDeleteSubject = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => subjectService.delete(id),
		onMutate: async (deletedId) => {
			await queryClient.cancelQueries({ queryKey: subjectKeys.all });

			const previousSubjects = queryClient.getQueryData<SubjectModel[]>(subjectKeys.all);

			queryClient.setQueryData<SubjectModel[]>(subjectKeys.all, (old = []) =>
				old.filter((subject) => subject._id !== deletedId),
			);

			return { previousSubjects };
		},
		onSuccess: (_res: any) => {
			toast.success("Subject deleted successfully");
			// Still refetch in background to sync with server
			queryClient.invalidateQueries({ queryKey: subjectKeys.all });
		},
		onError: (err: any, _id, context) => {
			toast.error(err?.response?.data?.error?.message || "Failed to delete subject.");
			if (context?.previousSubjects) {
				queryClient.setQueryData(subjectKeys.all, context.previousSubjects);
			}
		},
	});
};
