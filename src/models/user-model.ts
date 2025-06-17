export interface UserModel {
	_id: string;
	name: string;
	email: string;
	password: string;
	personId?: string;
	role: "admin" | "teacher";
	createdAt: Date;
	updatedAt: Date;
}
