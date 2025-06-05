import { twMerge } from "tailwind-merge";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

const Table = ({ children, className }: TableProps) => {
	return (
		<div className="overflow-x-auto">
			<table className={twMerge("w-full border-collapse border border-gray-300", className)}>
				{children}
			</table>
		</div>
	);
};

type TableHeadProps = React.TableHTMLAttributes<HTMLTableElement>;

Table.Head = ({ children, className }: TableHeadProps) => {
	return <thead className={twMerge("bg-gray-100", className)}>{children}</thead>;
};

type TableBodyProps = React.TableHTMLAttributes<HTMLTableElement>;
Table.Body = ({ children, className }: TableBodyProps) => {
	return <tbody className={twMerge("bg-white", className)}>{children}</tbody>;
};

type TableRowProps = React.TableHTMLAttributes<HTMLTableRowElement>;

Table.Row = ({ children, className }: TableRowProps) => {
	return <tr className={twMerge("border-b border-gray-300", className)}>{children}</tr>;
};

type TableCellProps = React.TableHTMLAttributes<HTMLTableCellElement> & {
	colSpan?: number;
};

Table.Cell = ({ children, className, colSpan }: TableCellProps) => {
	return (
		<td
			colSpan={colSpan}
			className={twMerge(
				"p-2 border border-x-0 border-t-0 border-gray-100 dark:border-gray-800 font-semibold text-primary-mild dark:text-primary-light",
				className,
			)}>
			{children}
		</td>
	);
};

export default Table;
