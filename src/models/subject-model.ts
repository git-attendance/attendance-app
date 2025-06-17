import type { UserModel } from "./user-model";

export interface SubjectModel extends Document {
	_id: string;
	code: string; // Subject code (e.g., "MATH101")
	name: string; // Subject name (e.g., "Introduction to Calculus")
	description: string; // Subject description
	schedule: {
		day: string; // Day of the week
		startTime: string; // Start time of the class
		endTime: string; // End time of the class
		room: string; // Room/venue of the class
	};
	semester: string; // Current semester (e.g., "Fall 2024")
	instructor: UserModel;
	createdAt: Date;
	updatedAt: Date;
}
