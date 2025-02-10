"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataRow } from "./page";

interface DataTableProps {
  tableData: DataRow[];
}

export function DataTableRaw({ tableData }: DataTableProps) {
  const headers = Object.keys(tableData[0] || {});
  const columnWidths = headers.map(() => `${100 / headers.length}%`);

  return (
    <div className="border rounded-md w-full h-full flex flex-col">
      {/* Fixed Header */}
      <div className="w-full bg-white border-b">
        <Table>
          <colgroup>
            {columnWidths.map((width, i) => (
              <col key={i} style={{ width }} />
            ))}
          </colgroup>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead 
                  key={header} 
                  className="px-4 py-2 font-semibold bg-white border-b"
                  style={{ width: `${100 / headers.length}%` }}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
        <Table>
          <colgroup>
            {columnWidths.map((width, i) => (
              <col key={i} style={{ width }} />
            ))}
          </colgroup>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-gray-100">
                {headers.map((header) => (
                  <TableCell 
                    key={`${rowIndex}-${header}`} 
                    className="px-4 py-2 border whitespace-nowrap"
                    style={{ width: `${100 / headers.length}%` }}
                  >
                    {(row[header]?.toString() || '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}