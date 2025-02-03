type SensorData = {
    timestamp: string;
    sensor1: number;
    sensor2: number;
    sensor3: number;
  };
  
  const sensorDataArray: SensorData[] = [
    {
      timestamp: '2025-02-03T10:00:00Z',
      sensor1: 23.5,
      sensor2: 45.2,
      sensor3: 67.8,
    },
    {
      timestamp: '2025-02-03T10:05:00Z',
      sensor1: 24.1,
      sensor2: 46.0,
      sensor3: 68.3,
    },
    {
      timestamp: '2025-02-03T10:10:00Z',
      sensor1: 22.8,
      sensor2: 44.7,
      sensor3: 66.9,
    },
    {
      timestamp: '2025-02-03T10:15:00Z',
      sensor1: 23.9,
      sensor2: 45.5,
      sensor3: 67.5,
    },
  ];
  
  export default sensorDataArray;
  