import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import Query from '../../services/query';
import { actions } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import Plot from 'react-plotly.js';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';

const query = Query.Historical;
const useStyles = makeStyles({
  plot:{
    width: "100%", 
    height: "100%"
  },
  historicalCard:{
    height: "60vh"
  }
});

const getMeasurements = (state: IState) => {
  return state.measurements;
};

const layout:any = {
  autosize: true,
  margin: {
    b: 55,
    t: 35,
  },
  legend: {x: 0.4, y: 1.2, orientation: 'h'},
  xaxis: {
    domain: [0.06, 1],
    showgrid: false
  }
}

const Historical = ({selectedOption = [], initTime = Date.now(), options = []}) => {
  const measurements:any = useSelector(getMeasurements);
  const dispatch = useDispatch();
  const [result] = useQuery({
    query,
    variables: {
      input: options ? options.map((metric:any) => ({metricName: metric.value, after: initTime})) : [],
    },
  });
  const { data, error } = result;
  const [dynamicLayout, setDynamicLayout] = useState({});
  const [units, setUnits] = useState([]);
  const classes:any = useStyles();

  useEffect(() => {
    if (error) {
      dispatch(actions.apiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.historicalDataRecevied(getMultipleMeasurements));
  }, [dispatch, data, error]);

  useEffect(() => {
    const units_ = selectedOption ? selectedOption.reduce((res:any, measurement:any) => {
        if(!res.includes(measurement.unit)){
          res.push(measurement.unit)
        }
      return res;
    }, []):[];

    setUnits(units_);
  }, [selectedOption]);

  useEffect(() => {
    let layoutType = units.length; 
    let yaxis = {
      title: units[0],
      linecolor: '#636363',
      showgrid: false,
    }
    let yaxis2 = {
      title: units[1],
      linecolor: '#636363',
      showgrid: false,
      anchor: 'free',
      overlaying: 'y',
      side: 'left',
    }
    let yaxis3 = {
      title: units[2],
      linecolor: '#636363',
      showgrid: false,
      anchor: 'x',
      overlaying: 'y',
      side: 'right',
    }
    if(layoutType===1){
      setDynamicLayout({...layout, yaxis})
    }else if(layoutType===2){
      setDynamicLayout({...layout, yaxis, yaxis2})
    }else if(layoutType===3){
      setDynamicLayout({...layout, yaxis, yaxis2, yaxis3})
    }
  }, [units]);

  const chooseYaxis = (unit:string) => {
    let layoutType = units.length; 
    if(layoutType===1){
      return 'y1'
    }else if(layoutType===2){
      if(units[0] === unit){
        return 'y1'
      }else {
        return 'y2'
      }
    }else if(layoutType===3){
      if(units[0] === unit){
        return 'y1'
      }else if (units[1] === unit){
        return 'y2'
      }else{
        return 'y3'
      }
    }
  }

  return (
    <div>
      {selectedOption &&
        selectedOption.length>0 &&
          <Card elevation={0} className={classes.historicalCard}>
          <Plot data={selectedOption.map((measurement:any) => {
              return (measurement.value in measurements) ?
              { x: measurements[measurement.value].x, 
                y: measurements[measurement.value].y, 
                yaxis: chooseYaxis(measurements[measurement.value].unit),
                type: 'scatter', 
                name: `${measurement.value} ${measurements[measurement.value].unit}`
              } : {}
            })} 
            layout={dynamicLayout}     
            useResizeHandler={true}
            className={classes.plot}
          />
          </Card>
      }  
    </div>
  );
};

export default Historical;