import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type LastData = {
  metric: string;
  value: number;
  at: number;
  unit: string;
};

const formatValue = (value: number) => (Math.round(value * 100) / 100).toFixed(2);
const initialState = {};

const slice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    historicalDataRecevied: (state: any, action: PayloadAction<[]>) => {
      const arrayMeasurements:any = action.payload;
      for (let measurement of arrayMeasurements) {
        const lastMeasurement = measurement.measurements[measurement.measurements.length - 1];
        state[measurement.metric] = {
          name: measurement.metric, 
          last: {value: formatValue(lastMeasurement.value), at: lastMeasurement.at},
          x: measurement.measurements.map((point:any) => new Date(point.at)),
          y: measurement.measurements.map((point:any) => point.value), 
          unit: lastMeasurement.unit === "F" ? "°F" : lastMeasurement.unit
        };
      }
    },
    apiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    lastDataRecevied: (state:any, action: PayloadAction<LastData>) => {
      const { metric, value, at, unit } = action.payload;
      if (state[metric]) {
        state[metric].last = { value: formatValue(value), at, unit }
        state[metric].x.push(new Date(at))
        state[metric].y.push(value)
      }
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;