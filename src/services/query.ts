enum Query {
  Weather = `
    query($latLong: WeatherQuery!) {
      getWeatherForLocation(latLong: $latLong) {
        description
        locationName
        temperatureinCelsius
      }
    }
  `,
  allMetrics = `
    query {
      getMetrics
    }
  `,
  Historical = `
    query($input: [MeasurementQuery]) {
      getMultipleMeasurements(input: $input)
      {
        metric
        measurements{
          at
          value
          unit
        }
      }
    }
  `,
  Tick = `
    subscription {
      newMeasurement{
        metric
        value
        at
        unit
      }
    }
  ` 
}

export default Query;