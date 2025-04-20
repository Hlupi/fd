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
import { Pagination } from "./pagination";
import Search from "@ingka/search";
import Button from "@ingka/button";
import arrowDownIcon from "@ingka/ssr-icon/paths/arrow-down";
import SSRIcon from "@ingka/ssr-icon";

type ForecastData = {
  date: string;
  region: string;
  product: string;
  demand: number;
};

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

export function ForecastTable({ data }: { data: ForecastData[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
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

  return (
    <div>
      <Search
        id="search"
        placeholder="Search..."
        size="small"
        onChange={(e) => setGlobalFilter(e.target.value)}
        onClear={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
      />

      <div>
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
                      className="header-button"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <SSRIcon
                        paths={arrowDownIcon}
                        className={`sorting-icon ${header.column.getIsSorted() ? "sorting-icon--active" : ""} ${header.column.getIsSorted() === "desc" ? "sorting-icon--rotated" : ""}`}
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
      </div>

      <Pagination
        totalPages={table.getPageCount()}
        currentPage={table.getState().pagination.pageIndex}
        onClick={table.setPageIndex}
        hasPrevPage={table.getCanPreviousPage()}
        hasNextPage={table.getCanNextPage()}
      />
    </div>
  );
}
