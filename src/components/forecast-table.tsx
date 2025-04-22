import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  ColumnFiltersState,
  FilterFn,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Table, { TableBody, TableHeader } from "@ingka/table";
import Search from "@ingka/search";
import Button from "@ingka/button";
import arrowDownIcon from "@ingka/ssr-icon/paths/arrow-down";
import SSRIcon from "@ingka/ssr-icon";
import Skeleton from "@ingka/skeleton";

import { Pagination } from "./pagination";
import { ForecastData } from "@/hooks/use-get-forecast";

const columnHelper = createColumnHelper<ForecastData>();

const globalFilterFn: FilterFn<ForecastData> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);

  if (value === undefined || value === null) return false;
  const valueStr = String(value).toLowerCase();
  const filterStr = String(filterValue).toLowerCase();

  return valueStr.includes(filterStr);
};

const columns = [
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("region", {
    header: "Region",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("product", {
    header: "Product",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("demand", {
    header: "Demand",
    cell: (info) => info.getValue(),
  }),
];

export function ForecastTable({
  data,
  className,
}: {
  data: ForecastData[] | null;
  className?: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const sortingIconClassName = "table__header-button__sorting-icon";

  return (
    <div className={className}>
      <Search
        id="search"
        placeholder="Search..."
        size="small"
        onChange={(e) => setGlobalFilter(e.target.value)}
        onClear={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
        clearBtnText="Clear search"
        submitBtnText="Search"
        ariaLabel="Search through the forecast data"
        disabled={!data || !data.length}
      />
      <section aria-busy={data ? "false" : "true"} aria-live="polite">
        {data ? (
          <>
            <Table fullWidth>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        <Button
                          type="plain"
                          size="small"
                          aria-label={`Sort by ${String(header.column.columnDef.header)} ${
                            header.column.getIsSorted() === "asc"
                              ? "ascending"
                              : "descending"
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                          className="table__header-button"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <SSRIcon
                            paths={arrowDownIcon}
                            className={`${sortingIconClassName} ${header.column.getIsSorted() ? `${sortingIconClassName}--active` : ""} ${header.column.getIsSorted() === "desc" ? `${sortingIconClassName}--rotated` : ""}`}
                          />
                        </Button>
                      </th>
                    ))}
                  </tr>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length}>No results found</td>
                  </tr>
                )}
              </TableBody>
            </Table>

            <Pagination
              totalPages={table.getPageCount()}
              currentPage={table.getState().pagination.pageIndex}
              onClick={table.setPageIndex}
              hasPrevPage={table.getCanPreviousPage()}
              hasNextPage={table.getCanNextPage()}
            />
          </>
        ) : (
          <ForecastTableLoading />
        )}
      </section>
    </div>
  );
}

function ForecastTableLoading() {
  const headers = ["Date", "Region", "Product", "Demand"];
  return (
    <Table fullWidth>
      <TableHeader>
        <tr>
          {headers.map((header) => (
            <th key={header}>
              <Button
                type="plain"
                size="small"
                className="table__header-button--disabled"
                text={header}
              />
            </th>
          ))}
        </tr>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <tr key={index}>
            <td>
              <Skeleton width="124px" />
            </td>
            <td>
              <Skeleton width="98px" />
            </td>
            <td>
              <Skeleton width="106px" />
            </td>
            <td>
              <Skeleton width="110px" />
            </td>
          </tr>
        ))}
      </TableBody>
    </Table>
  );
}
