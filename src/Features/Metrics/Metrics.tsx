import React, { useEffect } from 'react';
import Query from '../../services/query';
import { useSubscription, SubscriptionHandler } from 'urql';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../Historical/reducer';
import { IState } from '../../store';
import CircularProgress from '@material-ui/core/CircularProgress';

const query = Query.Tick;
const useStyles = makeStyles({
  root: {
    minWidth: 250,
    maxWidth: 300,
    margin: "10px 10px 10px 0px"
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 0
  },
  value:{
    fontSize: 40,
  }
});

const handleSubscription: SubscriptionHandler<any, any> = (messages = [], response) => {
  return response.newMeasurement;
};

const getMeasurements = (state: IState) => {
  return state.measurements;
};

const Metric = ({selectedOption = []}) => {
  const dispatch = useDispatch();
  const measurements: any = useSelector(getMeasurements);
  const classes = useStyles();

  const [result] = useSubscription({ query }, handleSubscription);
  useEffect(() => {
    if (result.data) {
      dispatch(actions.lastDataRecevied(result.data));
    }
  }, [dispatch, result]);

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
    >
      {selectedOption && selectedOption.map((measurement: any) => (
        <Card elevation={0} className={classes.root} key={measurement.value}>
          <CardContent style={{padding:15}}>
            <Typography className={classes.title} gutterBottom>
              {measurement.value}
            </Typography>
            <Typography className={classes.value} component="h3">
              {
                measurement.value in measurements ?
                measurements[measurement.value].last.value + "" + measurements[measurement.value].unit :
                <CircularProgress />
              }
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
};

export default Metric;
