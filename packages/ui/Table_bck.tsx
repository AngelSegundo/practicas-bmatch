import { useEffect } from "react";
import { useTable, Column, useSortBy, useGlobalFilter } from "react-table";
import TableHeaderCell from "./TableHeaderCell";

import classNames from "classnames";

import React from "react";

export interface TableRow {
  id: string | undefined;
}
export interface TableProps<D extends TableRow> {
  data: D[];
  columns: Column<D>[];
  filter?: string;
  isDense?: boolean;
  backgroundFooter?: string;
  isFooter?: boolean;
}

function Table<T extends TableRow>({
  columns,
  data,
  filter,
  isDense,
  backgroundFooter,
  isFooter = false,
}: TableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    footerGroups,
  } = useTable<T>(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  useEffect(() => {
    setGlobalFilter(filter || "");
  }, [filter]);
  const commonClass = "whitespace-nowrap pl-4 pr-3 text-sm sm:pl-6";

  const cellClassName = classNames(commonClass, {
    "py-4": !isDense,
  });
  return (
    <div className="mt-4 flex flex-col">
      <div className="-my-2 -mx-4 min-w-full md:overflow-x-auto lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div
            className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg block overflow-y-scroll"
            style={{ maxHeight: "88vh" }}
          >
            <table
              className="min-w-full divide-y divide-gray-300"
              {...getTableProps()}
            >
              <thead className="sticky top-0 left-0 right-0 bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        className="py-3.5 pl-4 pr-3 sm:pl-6 text-xs leading-4 font-medium tracking-wider uppercase text-gray-500"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <div className={`flex flex-row items-center`}>
                          {column.render("Header")}
                          {column.isSorted && column.isSortedDesc && (
                            <TableHeaderCell
                              isSortedDesc={column.isSortedDesc}
                            />
                          )}
                          {column.isSorted && !column.isSortedDesc && (
                            <TableHeaderCell
                              isSortedDesc={column.isSortedDesc}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                className="divide-y divide-gray-200 bg-white"
                {...getTableBodyProps()}
              >
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            className={cellClassName}
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              {isFooter ? (
                <tfoot
                  className={classNames(
                    "divide-y divide-gray-200 bg-gray-50",
                    backgroundFooter
                  )}
                >
                  {footerGroups.map((group) => (
                    <tr {...group.getFooterGroupProps()}>
                      {group.headers.map((column) => (
                        <td
                          className={cellClassName}
                          {...column.getFooterProps()}
                        >
                          {column.render("Footer")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              ) : null}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
