const ITEMS_PER_PAGE = 10;

export const PaginationControls = ({
	currentPage,
	totalItems,
	onPageChange,
}: {
	currentPage: number;
	totalItems: number;
	onPageChange: (page: number) => void;
}) => {
	const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

	if (totalPages <= 1) return null;

	return (
		<div className="flex justify-end items-center gap-2 mt-4">
			<button
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				className="text-sm px-2 py-1 border rounded disabled:opacity-50">
				Previous
			</button>
			<span className="text-sm">
				Page {currentPage} of {totalPages}
			</span>
			<button
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				className="text-sm px-2 py-1 border rounded disabled:opacity-50">
				Next
			</button>
		</div>
	);
};
