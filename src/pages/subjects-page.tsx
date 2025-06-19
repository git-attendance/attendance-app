import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, BookOpen, MapPin, Clock, User, Trash2, Pencil } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useCreateSubject,
	useDeleteSubject,
	useSubjects,
	useUpdateSubject,
} from "@/hooks/use-subjects";
import { useUsers } from "@/hooks/use-user";
import type { UserModel } from "@/models/user-model";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatTime } from "@/utils/common";

export default function Subjects() {
	const { data: subjects } = useSubjects();
	const { data: users = [] } = useUsers();
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [editingSubject, setEditingSubject] = useState<any>(null);

	const instructors = users.filter((user: UserModel) => user.role === "teacher");

	useEffect(() => {
		if (instructors.length > 0 && !formData.instructor) {
			setFormData((prev) => ({
				...prev,
				instructor: instructors[0]._id,
			}));
		}
	}, [instructors]);

	const [showAddForm, setShowAddForm] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		code: "",
		description: "",
		instructor: "",
		room: "",
		day: "Monday",
		startTime: "09:00",
		endTime: "10:00",
		semester: "Fall 2025",
	});

	const createSubject = useCreateSubject();
	const updateSubject = useUpdateSubject();
	const deleteSubject = useDeleteSubject();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const payload = {
			code: formData.code,
			name: formData.name,
			description: formData.description,

			schedule: {
				day: formData.day,
				startTime: formData.startTime,
				endTime: formData.endTime,
				room: formData.room,
			},

			semester: formData.semester,
			instructor: formData.instructor,
		};

		if (editingSubject) {
			updateSubject.mutate(
				{ id: editingSubject._id, data: payload },
				{
					onSuccess: () => {
						setShowAddForm(false);
						resetForm();
						setEditingSubject(null);
					},
				},
			);
		} else {
			createSubject.mutate(payload, {
				onSuccess: () => {
					setShowAddForm(false);
					resetForm();
				},
			});
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			code: "",
			description: "",
			instructor: instructors[0]?._id ?? "",
			room: "",
			day: "Monday",
			startTime: "09:00",
			endTime: "10:00",
			semester: "Fall 2025",
		});
	};

	const handleEdit = (subject: any) => {
		setEditingSubject(subject);
		setFormData({
			name: subject.name,
			code: subject.code,
			description: subject.description,
			instructor: subject.instructor?._id || instructors[0]?._id || "",
			room: subject.schedule.room,
			day: subject.schedule.day,
			startTime: subject.schedule.startTime,
			endTime: subject.schedule.endTime,
			semester: subject.semester,
		});
		setShowAddForm(true);
	};

	const handleDelete = (subjectId: string) => {
		deleteSubject.mutate(subjectId, {});
	};

	return (
		<div className="p-6 space-y-6 min-h-screen">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Subjects</h1>
					<p className="text-gray-600 mt-2">Manage your school subjects and schedules</p>
				</div>

				<Dialog
					open={showAddForm}
					onOpenChange={(open) => {
						if (!open) {
							setShowAddForm(false);
							setEditingSubject(null);
							resetForm();
						} else {
							setShowAddForm(true);
						}
					}}>
					<DialogTrigger asChild>
						<Button
							onClick={() => setShowAddForm((prev) => !prev)}
							className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							Add Subject
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>
								{editingSubject ? "Edit Subject" : "Add New Subject"}
							</DialogTitle>
							<DialogDescription>
								{editingSubject
									? "Update the subject details"
									: "Enter the details for the new subject"}
							</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name" className="mb-2">
										Subject Name
									</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({
												...formData,
												name: e.target.value,
											})
										}
										placeholder="Mathematics"
										required
									/>
								</div>
								<div>
									<Label htmlFor="description" className="mb-2">
										Description
									</Label>
									<Input
										id="description"
										value={formData.description}
										onChange={(e) =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
										placeholder="Introduction to Mathematics"
									/>
								</div>
								<div>
									<Label htmlFor="code" className="mb-2">
										Subject Code
									</Label>
									<Input
										id="code"
										value={formData.code}
										onChange={(e) =>
											setFormData({
												...formData,
												code: e.target.value,
											})
										}
										placeholder="MATH101"
										required
									/>
								</div>
								<div>
									<Label htmlFor="instructor" className="mb-2">
										Instructor
									</Label>
									<select
										id="instructor"
										value={formData.instructor}
										onChange={(e) =>
											setFormData({
												...formData,
												instructor: e.target.value,
											})
										}
										className="w-full p-2 border rounded">
										{instructors.map((instr: any) => (
											<option key={instr._id} value={instr._id}>
												{instr.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<Label htmlFor="room" className="mb-2">
										Room
									</Label>
									<Input
										id="room"
										value={formData.room}
										onChange={(e) =>
											setFormData({
												...formData,
												room: e.target.value,
											})
										}
										placeholder="Room 201"
										required
									/>
								</div>
								<div>
									<Label htmlFor="day" className="mb-2">
										Day
									</Label>
									<Input
										id="day"
										value={formData.day}
										onChange={(e) =>
											setFormData({
												...formData,
												day: e.target.value,
											})
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="startTime" className="mb-2">
										Start Time
									</Label>
									<Input
										type="time"
										id="startTime"
										value={formData.startTime}
										onChange={(e) =>
											setFormData({
												...formData,
												startTime: e.target.value,
											})
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="endTime" className="mb-2">
										End Time
									</Label>
									<Input
										type="time"
										id="endTime"
										value={formData.endTime}
										onChange={(e) =>
											setFormData({
												...formData,
												endTime: e.target.value,
											})
										}
										required
									/>
								</div>
								<div>
									<Label htmlFor="semester" className="mb-2">
										Semester
									</Label>
									<Input
										id="semester"
										value={formData.semester}
										onChange={(e) =>
											setFormData({
												...formData,
												semester: e.target.value,
											})
										}
										required
									/>
								</div>
							</div>
							<div className="flex gap-2">
								<Button type="submit">
									{editingSubject ? "Update Subject" : "Add Subject"}
								</Button>
								<Button
									variant="outline"
									type="button"
									onClick={() => {
										setShowAddForm(false);
										setEditingSubject(null);
										resetForm();
									}}>
									Cancel
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{subjects?.map((sub: any) => (
					<Card
						key={sub._id}
						className="relative overflow-hidden bg-white"
						style={{
							background: `linear-gradient(135deg, ${sub.instructor ? sub.instructor.color : "#ccc"} 0%, ${sub.instructor ? sub.instructor.color + "99" : "#ccc99"} 100%)`,
						}}>
						<CardHeader className="pb-3 flex justify-between">
							<div>
								<CardTitle className="text-lg text-neutral-800">
									{sub.name}
								</CardTitle>
								<CardDescription className="text-xs text-neutral-600 mb-2">
									{sub.description || "No description available"}
								</CardDescription>
								<CardDescription className="font-mono text-sm">
									{sub.code}
								</CardDescription>
							</div>
							<div className="flex gap-2">
								<Button variant="ghost" size="icon" onClick={() => handleEdit(sub)}>
									<Pencil className="h-4 w-4 text-blue-500" />
								</Button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => setDeleteId(sub._id)}>
											<Trash2 className="h-4 w-4 text-red-500" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
											<AlertDialogDescription>
												Are you sure you want to delete this subject?
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												className="bg-red-500 text-white hover:bg-red-600"
												onClick={() => {
													if (deleteId) handleDelete(deleteId);
												}}>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardHeader>

						<CardContent className="space-y-3">
							<div className="flex items-center gap-2 text-sm">
								<User className="h-4 w-4" />
								<span>{sub.instructor?.name || "No instructor assigned"}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<MapPin className="h-4 w-4" />
								<span>{sub.schedule.room}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Clock className="h-4 w-4" />
								<span>
									{`${sub.schedule.day} ${formatTime(sub.schedule.startTime)}-${formatTime(sub.schedule.endTime)}`}
								</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{subjects?.length === 0 && !showAddForm && (
				<Card className="text-center py-12 bg-white">
					<CardContent>
						<BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium">No subjects yet</h3>
						<p className="text-gray-600 mb-4">
							Get started by adding your first subject
						</p>
						<Button onClick={() => setShowAddForm(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Subject
						</Button>
					</CardContent>
				</Card>
			)}

			{subjects?.length > 0 && (
				<Card className="bg-white">
					<CardHeader>
						<CardTitle>All Subjects</CardTitle>
						<CardDescription>Complete list of subjects in the system</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Subject</TableHead>
									<TableHead>Code</TableHead>
									<TableHead>Instructor</TableHead>
									<TableHead>Room</TableHead>
									<TableHead>Schedule</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{subjects?.map((sub: any) => (
									<TableRow key={sub._id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div
													className="w-3 h-3 rounded-full"
													style={{
														backgroundColor:
															sub.instructor?.color || "#ccc",
													}}
												/>
												<span className="font-medium">{sub.name}</span>
											</div>
										</TableCell>
										<TableCell className="font-mono text-sm">
											{sub.code}
										</TableCell>
										<TableCell>{sub.instructor?.name}</TableCell>
										<TableCell>{sub.schedule.room}</TableCell>
										<TableCell>{`${sub.schedule.day} ${sub.schedule.startTime}-${sub.schedule.endTime}`}</TableCell>
										<TableCell className="flex gap-2">
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleEdit(sub)}>
												<Pencil className="h-4 w-4 text-blue-500" />
											</Button>
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														onClick={() => setDeleteId(sub._id)}>
														<Trash2 className="h-4 w-4 text-red-500" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Confirm Deletion
														</AlertDialogTitle>
														<AlertDialogDescription>
															Are you sure you want to delete this
															subject?
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>
															Cancel
														</AlertDialogCancel>
														<AlertDialogAction
															className="bg-red-500 text-white hover:bg-red-600"
															onClick={() => {
																if (deleteId)
																	handleDelete(deleteId);
															}}>
															Delete
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
