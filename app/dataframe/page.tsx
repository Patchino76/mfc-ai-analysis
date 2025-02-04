import React from 'react'
import { sensorData, SensorData } from '@/data/sensorData';
import { TableView } from '../components/TableView';

interface SensorTableProps {
    data: SensorData[];
  }
  
const AnalysisPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <TableView 
        data={sensorData}
        // className="w-1/2 mx-auto"
      />
    </div>
  )
}

export default AnalysisPage  