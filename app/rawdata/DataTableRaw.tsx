"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Thermometer, Gauge, Droplets, Wind } from "lucide-react";
import { DataRow } from "../chat/page";

export function DataTableRaw({ tableData }: { tableData: DataRow[] }) {
  const headers = Object.keys(tableData[0] || {});
  const columnWidths = headers.map(() => `${100 / headers.length}%`);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Thermometer className="h-6 w-6 text-blue-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Temperature</p>
            <p className="text-2xl font-bold">23.5°C</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <Gauge className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pressure</p>
            <p className="text-2xl font-bold">1013 hPa</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <Droplets className="h-6 w-6 text-purple-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-2xl font-bold">45%</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <Wind className="h-6 w-6 text-orange-700" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Wind Speed</p>
            <p className="text-2xl font-bold">12 km/h</p>
          </div>
        </Card>
      </div>

      <div style={{ overflow: 'auto', maxHeight: '700px', overflowX: 'scroll', width: '100%' }}>
        <Table style={{ minWidth: '100%' }}>
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
                  style={{ 
                    position: 'sticky', 
                    top: 0, 
                    background: '#fff', 
                    zIndex: 1, 
                    width: `${100 / headers.length}%` 
                  }}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
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