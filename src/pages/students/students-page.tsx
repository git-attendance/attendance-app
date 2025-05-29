import UserTable from "@/components/tables/user-table";
import { mock_users } from "@/configs/test/mocked-data";

const StudentsPage = () => {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">Students</h1>
			<UserTable users={mock_users} />
		</div>
	);
};

export default StudentsPage;
