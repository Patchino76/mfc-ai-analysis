"use client";
import React from 'react';
import { DataTableRaw } from "./DataTableRaw";
import { useRawTable } from "../hooks/useChat";

const RawDataPage = () => {
  const {data : rawTableData} = useRawTable();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">

          {rawTableData && <DataTableRaw tableData={rawTableData} />}

    </div>
  )
}

export default RawDataPage