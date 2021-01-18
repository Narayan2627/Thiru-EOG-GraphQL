import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as historicalReducer } from '../Features/Historical/reducer';

export default {
  weather: weatherReducer,
  measurements: historicalReducer
};
