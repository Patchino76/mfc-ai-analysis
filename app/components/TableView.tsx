// components/sensors/sensor-table.tsx
"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SensorData } from "@/data/sensorData";
import { ArrowUpDown } from "lucide-react";

interface SensorTableProps {
  data: SensorData[];
  className?: string;
}

export function TableView({ data, className }: SensorTableProps) {
  const [columns] = useState<ColumnDef<SensorData>[]>(() => {
    if (!data[0]) return [];
    return Object.keys(data[0]).map((key) => ({
      accessorKey: key,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="capitalize"
        >
          {key.replace(/_/g, " ")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue(key);
        return typeof value === "number" 
          ? value.toFixed(2)
          : value instanceof Date
          ? value.toLocaleString()
          : value;
      },
    }));
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className={`${className} rounded-md border grid grid-rows-[auto_1fr]`}>
      {/* Fixed Header */}
      <div className="bg-gray-50 border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div>

      {/* Scrollable Body */}
      <div className="overflow-auto">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2 border">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}