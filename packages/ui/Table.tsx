import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  SortAscendingIcon,
  SortDescendingIcon,
} from "@heroicons/react/outline";
import classNames from "classnames";
import { useState } from "react";

export interface TableProps<D> {
  columns: unknown;
  rows: D[];
  filter?: string;
  onChangeFilter?: (filter: string) => void;
  isDense?: boolean;
  initialColumnSort?: ColumnSort | undefined;
}

export function Table<D>({
  rows,
  columns,
  filter = "",
  onChangeFilter = () => {
    /* */
  },
  isDense,
  initialColumnSort = undefined,
}: TableProps<D>) {
  const [sortingState, setSortingState] = useState<SortingState>(
    initialColumnSort ? [initialColumnSort] : []
  );
  const table = useReactTable({
    data: rows,
    columns: columns as ColumnDef<D>[],
    state: {
      sorting: sortingState,
      globalFilter: filter,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSortingState,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: onChangeFilter,
  });

  const commonClass = "whitespace-nowrap pl-4 pr-3 text-sm sm:pl-6";

  const cellClassName = classNames(commonClass, {
    "py-4": !isDense,
    "py-2": isDense,
  });
  return (
    <div className="mt-4 flex flex-col">
      <div className="-my-2 -mx-4 min-w-full md:overflow-x-auto lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden rounded-md shadow ring-1 ring-black ring-opacity-5 md:rounded-lg block overflow-y-scroll">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="sticky top-0 left-0 right-0 bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isSortable = header.column.getCanSort();
                      const sort = header.column.getIsSorted();
                      return (
                        <th
                          key={header.id}
                          className="py-3.5 pl-4 pr-3 sm:pl-6 text-xs leading-4 font-medium tracking-wider uppercase text-gray-500"
                          colSpan={header.colSpan}
                        >
                          <div
                            className={classNames(
                              `flex flex-row items-center`,
                              { "cursor-pointer": isSortable }
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {isSortable && sort === "asc" && (
                                <SortAscendingIcon className="h-4 w-4 ml-2 text-gray-400" />
                              )}
                              {isSortable && sort === "desc" && (
                                <SortDescendingIcon className="h-4 w-4 ml-2 text-gray-400" />
                              )}
                            </>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td className={cellClassName} key={cell.id}>
                          <>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
