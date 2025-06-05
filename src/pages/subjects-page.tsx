import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, BookOpen, MapPin, Clock, User, Trash2 } from "lucide-react";
import { useAttendance } from "@/contexts/attendance-context";
import Table from "@/components/ui/table";

const Subjects = () => {
	const { state, addSubject, deleteSubject } = useAttendance();
	const [showAddForm, setShowAddForm] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		code: "",
		instructor: "",
		room: "",
		schedule: "",
		color: "#3B82F6",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addSubject(formData);
		setFormData({
			name: "",
			code: "",
			instructor: "",
			room: "",
			schedule: "",
			color: "#3B82F6",
		});
		setShowAddForm(false);
	};

	const predefinedColors = [
		"#3B82F6",
		"#EF4444",
		"#10B981",
		"#F59E0B",
		"#8B5CF6",
		"#EC4899",
		"#06B6D4",
		"#84CC16",
	];

	return (
		<div className="p-6 space-y-6 min-h-screen">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Subjects
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-2">
						Manage your school subjects and schedules
					</p>
				</div>
				<Button
					onClick={() => setShowAddForm(!showAddForm)}
					className="flex items-center gap-2">
					<Plus className="h-4 w-4" />
					Add Subject
				</Button>
			</div>

			{showAddForm && (
				<Card className="border-dashed bg-white dark:bg-gray-900">
					<CardHeader>
						<CardTitle className="dark:text-gray-100">Add New Subject</CardTitle>
						<CardDescription className="dark:text-gray-400">
							Enter the details for the new subject
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name" className="dark:text-gray-200 mb-2">
										Subject Name
									</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder="e.g., Mathematics"
										required
										className="dark:bg-gray-800 dark:text-gray-100"
									/>
								</div>
								<div>
									<Label htmlFor="code" className="dark:text-gray-200 mb-2">
										Subject Code
									</Label>
									<Input
										id="code"
										value={formData.code}
										onChange={(e) =>
											setFormData({ ...formData, code: e.target.value })
										}
										placeholder="e.g., MATH101"
										required
										className="dark:bg-gray-800 dark:text-gray-100"
									/>
								</div>
								<div>
									<Label htmlFor="instructor" className="dark:text-gray-200 mb-2">
										Instructor
									</Label>
									<Input
										id="instructor"
										value={formData.instructor}
										onChange={(e) =>
											setFormData({ ...formData, instructor: e.target.value })
										}
										placeholder="e.g., John Smith"
										required
										className="dark:bg-gray-800 dark:text-gray-100"
									/>
								</div>
								<div>
									<Label htmlFor="room" className="dark:text-gray-200 mb-2">
										Room
									</Label>
									<Input
										id="room"
										value={formData.room}
										onChange={(e) =>
											setFormData({ ...formData, room: e.target.value })
										}
										placeholder="e.g., Room 201"
										required
										className="dark:bg-gray-800 dark:text-gray-100"
									/>
								</div>
								<div>
									<Label htmlFor="schedule" className="dark:text-gray-200 mb-2">
										Schedule
									</Label>
									<Input
										id="schedule"
										value={formData.schedule}
										onChange={(e) =>
											setFormData({ ...formData, schedule: e.target.value })
										}
										placeholder="e.g., Mon-Wed-Fri 9:00-10:00"
										required
										className="dark:bg-gray-800 dark:text-gray-100"
									/>
								</div>
								<div>
									<Label htmlFor="color" className="dark:text-gray-200 mb-2">
										Color
									</Label>
									<div className="flex gap-2 mt-2">
										{predefinedColors.map((color) => (
											<button
												key={color}
												type="button"
												onClick={() => setFormData({ ...formData, color })}
												className={`w-8 h-8 rounded-full border-2 ${
													formData.color === color
														? "border-gray-800 dark:border-gray-100"
														: "border-gray-300 dark:border-gray-700"
												}`}
												style={{ backgroundColor: color }}
											/>
										))}
									</div>
								</div>
							</div>
							<div className="flex gap-2">
								<Button type="submit">Add Subject</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => setShowAddForm(false)}>
									Cancel
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{state.subjects?.map((subject) => (
					<Card
						key={subject.id}
						className="relative overflow-hidden bg-white dark:bg-gray-900"
						style={{
							background: `linear-gradient(135deg, ${subject.color} 0%, ${subject.color}99 100%)`,
						}}>
						<CardHeader className="pb-3">
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-lg text-neutral-50 dark:text-neutral-50">
										{subject.name}
									</CardTitle>
									<CardDescription className="font-mono text-sm text-neutral-50 dark:text-neutral-200">
										{subject.code}
									</CardDescription>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => deleteSubject(subject.id)}
									className="text-neutral-200 hover:text-neutral-50 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded-full">
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex items-center gap-2 text-sm text-neutral-50 dark:text-neutral-200">
								<User className="h-4 w-4" />
								<span>{subject.instructor}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-neutral-50 dark:text-neutral-200">
								<MapPin className="h-4 w-4" />
								<span>{subject.room}</span>
							</div>
							<div className="flex items-center gap-2 text-sm text-neutral-50 dark:text-neutral-200">
								<Clock className="h-4 w-4" />
								<span>{subject.schedule}</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{state.subjects?.length === 0 && !showAddForm && (
				<Card className="text-center py-12 bg-white dark:bg-gray-900">
					<CardContent>
						<BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
							No subjects yet
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							Get started by adding your first subject
						</p>
						<Button onClick={() => setShowAddForm(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Subject
						</Button>
					</CardContent>
				</Card>
			)}

			{(state.subjects?.length ?? 0) > 0 && (
				<Card className="bg-white dark:bg-gray-900">
					<CardHeader>
						<CardTitle className="dark:text-gray-100">All Subjects</CardTitle>
						<CardDescription className="dark:text-gray-400">
							Complete list of subjects in the system
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table className="border-0 w-full">
							<Table.Head className="bg-white dark:bg-gray-900 border border-x-0 border-t-0 border-gray-100 dark:border-gray-800">
								<Table.Row>
									<Table.Cell className="dark:text-gray-200 mb-2">
										Subject
									</Table.Cell>
									<Table.Cell className="dark:text-gray-200 mb-2">
										Code
									</Table.Cell>
									<Table.Cell className="dark:text-gray-200 mb-2">
										Instructor
									</Table.Cell>
									<Table.Cell className="dark:text-gray-200 mb-2">
										Room
									</Table.Cell>
									<Table.Cell className="dark:text-gray-200 mb-2">
										Schedule
									</Table.Cell>
									<Table.Cell className="dark:text-gray-200 mb-2">
										Actions
									</Table.Cell>
								</Table.Row>
							</Table.Head>
							<Table.Body>
								{state.subjects?.map((subject) => (
									<Table.Row
										key={subject.id}
										className="bg-white dark:bg-gray-950">
										<Table.Cell>
											<div className="flex items-center gap-3">
												<div
													className="w-3 h-3 rounded-full"
													style={{ backgroundColor: subject.color }}
												/>
												<span className="font-medium dark:text-gray-100">
													{subject.name}
												</span>
											</div>
										</Table.Cell>
										<Table.Cell className="font-mono text-sm dark:text-gray-200">
											{subject.code}
										</Table.Cell>
										<Table.Cell className="dark:text-gray-200 mb-2">
											{subject.instructor}
										</Table.Cell>
										<Table.Cell className="dark:text-gray-200 mb-2">
											{subject.room}
										</Table.Cell>
										<Table.Cell className="dark:text-gray-200 mb-2">
											{subject.schedule}
										</Table.Cell>
										<Table.Cell>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => deleteSubject(subject.id)}
												className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
												<Trash2 className="h-4 w-4" />
											</Button>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default Subjects;
