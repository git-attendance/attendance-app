import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { USER_TABLE_HEADERS } from "@/configs/table-constants";
import Avatar from "../ui/avatar";
import Table from "../ui/table";
import type { UserModel } from "@/models/test-user-model";
import { formatDate } from "@/utils/date-formatter";

interface UserTableProps {
	users: UserModel[];
	onEdit?: (user: UserModel) => void;
}

const UserTable = ({ users, onEdit }: UserTableProps) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div className="w-full">
			{!isMobile ? (
				<Table className="border-0 w-full">
					<Table.Head className="bg-white dark:bg-gray-900 border border-x-0 border-t-0 border-gray-100 dark:border-gray-800">
						<Table.Row className="border border-x-0 border-t-0 border-gray-100 dark:border-gray-800">
							{USER_TABLE_HEADERS.map((header) => (
								<Table.Cell
									key={header.key}
									className={`border border-x-0 border-t-0 border-gray-100 dark:border-gray-800 font-semibold text-primary-mild dark:text-primary-light ${header.className}`}>
									{header.label}
								</Table.Cell>
							))}
						</Table.Row>
					</Table.Head>
					<tbody>
						{users?.length > 0 ? (
							users?.map((user) => (
								<Table.Row
									key={user.userName}
									className="border border-x-0 border-gray-100 dark:border-gray-800">
									<Table.Cell className="border border-x-0 border-t-0 border-gray-100 dark:border-gray-800 p-5">
										{user.avatar ? (
											<Avatar
												src={user.avatar[0]}
												alt={user.firstName}
												size="small"
											/>
										) : (
											<div className="size-8 bg-gray-200 dark:bg-gray-700 p-1 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
												No Avatar
											</div>
										)}
									</Table.Cell>
									<Table.Cell className="border border-x-0 border-gray-100 dark:border-gray-800 p-5 font-medium text-primary dark:text-primary-light">
										{user.firstName} {user.lastName}
									</Table.Cell>
									<Table.Cell className="border border-x-0 border-gray-100 dark:border-gray-800 p-5">
										{user.userName || "N/A"}
									</Table.Cell>
									<Table.Cell className="border border-x-0 border-gray-100 dark:border-gray-800 p-5">
										{user.email}
									</Table.Cell>
									<Table.Cell className="border border-x-0 border-gray-100 dark:border-gray-800 p-5">
										{formatDate(user.createdAt ?? "", "dd/mm/yyyy")}
									</Table.Cell>

									<Table.Cell className="text-blue-600 dark:text-blue-400 cursor-pointer border border-x-0 border-gray-100 dark:border-gray-800 p-5">
										<button onClick={() => onEdit?.(user)}>Edit</button>
									</Table.Cell>
									<Table.Cell className="border border-x-0 border-gray-100 dark:border-gray-800 p-5 text-gray-400 dark:text-gray-500 text-sm font-medium">
										{formatDate(user.lastActive ?? new Date(), "timeAgo")}
									</Table.Cell>
								</Table.Row>
							))
						) : (
							<Table.Row>
								<Table.Cell
									colSpan={USER_TABLE_HEADERS.length}
									className="text-center text-gray-400 dark:text-gray-500 py-6">
									No users available.
								</Table.Cell>
							</Table.Row>
						)}
					</tbody>
				</Table>
			) : (
				<div className="space-y-4">
					{users?.length > 0 ? (
						users?.map((user) => (
							<div
								key={user.userName}
								className="p-4 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800">
								<div className="flex items-center gap-3">
									{user.avatar ? (
										<Avatar
											src={user.avatar[0]}
											alt={user.firstName}
											size="small"
										/>
									) : (
										<div className="size-10 bg-gray-200 dark:bg-gray-700 p-1 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm">
											No Avatar
										</div>
									)}
									<div>
										<h3 className="text-lg font-semibold text-primary dark:text-primary-light">
											{user.firstName} {user.lastName}
										</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{user.userName || "N/A"}
										</p>
									</div>
								</div>

								<div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
									<p>
										<strong>Email:</strong> {user.email}
									</p>
									<p>
										<strong>Signup Date:</strong>
										{formatDate(user.createdAt ?? "", "dd/mm/yyyy")}
									</p>
								</div>

								<div className="flex w-full justify-end mt-3">
									<Button
										className="text-sm rounded-2xl"
										variant="default"
										onClick={() => onEdit?.(user)}>
										Edit
									</Button>
								</div>
							</div>
						))
					) : (
						<div className="text-center text-gray-400 dark:text-gray-500 py-6">
							No users available.
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default UserTable;
