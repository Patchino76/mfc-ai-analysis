export interface SensorData {
  timestamp: Date;
  sensor_1: number;
  sensor_2: number;
  sensor_3: number;
  sensor_4: number;
  sensor_5: number;
  sensor_6: number;
  sensor_7: number;
  sensor_8: number;
  sensor_9: number;
  sensor_10: number;
}

export const sensorData: SensorData[] = Array.from({ length: 100 }, (_, i) => ({
  timestamp: new Date(Date.now() - i * 86400000),
  sensor_1: Math.random() * 10,
  sensor_2: Math.random() * 20 - 10,
  sensor_3: Math.random() * 5 + 15,
  sensor_4: Math.random() * 100,
  sensor_5: Math.random() * 50 + 50,
  sensor_6: Math.random() * 7 - 3.5,
  sensor_7: Math.random() * 30,
  sensor_8: Math.random() * 15 + 5,
  sensor_9: Math.random() * 200 - 100,
  sensor_10: Math.random() * 2.5,
}));

// Seedable random generator for reproducibility
const createPrng = (seed: number) => () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
