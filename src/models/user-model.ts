export interface UserModel {
	name: string;
	email: string;
	password: string;
	personId?: string;
	role: "student" | "admin" | "teacher";
	createdAt: Date;
	updatedAt: Date;
}
