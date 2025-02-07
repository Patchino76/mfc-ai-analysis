import React from 'react'
import { sensorData } from '@/data/sensorData';
import { TableView } from '../components/TableView';


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