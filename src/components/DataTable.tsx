"use client";

import { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string; // For header/cell width or alignment
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = "No results.",
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border bg-white dark:bg-card shadow-sm overflow-y-scroll max-h-[calc(90svh-200px)]">
      <Table>
        <TableHeader className="sticky top-0 bg-white dark:bg-card z-10 shadow-sm border-b">
          <TableRow>
            {columns.map((col, index) => (
              <TableHead
                key={index}
                className={cn("bg-white dark:bg-card", col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Cargando...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={keyExtractor(item)}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex} className={col.className}>
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                        ? (item[col.accessorKey] as ReactNode)
                        : null}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
