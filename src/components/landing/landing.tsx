import {
  AppBar,
  Button,
  Collapse,
  Container,
  createStyles,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListSubheader,
  makeStyles,
  OutlinedInput,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Save, Settings } from '@material-ui/icons';
import { SnackbarProvider, useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HistoricTable } from '../historic/HistoricTable';
import { ProviderSelector } from '../provider-selector/ProviderSelector';
import { Historic } from '../../model/historic/historic.schema';
import { Provider } from '../../model/provider/provider.schema';
import { Timer } from '../../model/timer/timer.schema';
import { ErrorMsg } from '../../typings/error.type';
import { isErrorMsg, traverse } from '../../utils/utils';
import { Preferences, PreferencesProps } from '../preferences/Preferences';

const { ipcRenderer } = window.require('electron');

const buttonClasses = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderColor: '#52af77',
      borderStyle: 'dashed',
      '&:focus, &:hover, &$active': {
        backgroundColor: '#65ce8f33',
      },
    },
    label: {
      color: 'rgba(0, 0, 0, 0.54)',
    },
  })
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainDiv: {
      marginTop: theme.spacing(4),
    },
    form: {
      marginLeft: theme.spacing(2),
      width: `calc(100% - ${theme.spacing(4)}px)`,
    },
    subheader: {
      display: 'flex',
    },
    title: {
      paddingTop: theme.spacing(1),
    },
  })
);

export const Landing = () => {
  const classes = useStyles();
  const buttonClassesObj = buttonClasses();
  // component did mount
  useEffect(() => {
    // backend wait time to fetch data
    getTime();
    getHistoric();
    getProviders();

    setLoading(false);
  }, []);
  const defaultTimer = new Timer();
  defaultTimer.notification_rate = 0;
  // app global
  const [isLoading, setLoading] = useState(true);
  const [timerConfig, toggleTimeConfig] = useState(false);
  const [notificationRate, setNotificationRate] = useState<number | ''>(0);
  const [savingNotificationRate, setSavingNotificationRate] = useState<boolean>(false);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  // Provider Selector
  const [providers, setProviders] = useState<Provider[]>([]);
  const [newProvider, setNewProvider] = useState<Provider>(new Provider());
  const [savingNewProvider, setSavingNewProvider] = useState<boolean>(false);

  // grid data
  const [gridData, setGridData] = useState<Historic[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const getTime = () => {
    const timer: Timer | ErrorMsg = ipcRenderer.sendSync('get-timer');
    if (isErrorMsg(timer)) {
      enqueueSnackbar(timer.msg, { variant: 'error' });
    } else {
      enqueueSnackbar(`You are receiving notification every: ${timer.notification_rate / 1000} seconds`, { variant: 'success' });
      setNotificationRate(timer.notification_rate);
    }
  };

  const getHistoric = () => {
    const historic: Historic[] | ErrorMsg = ipcRenderer.sendSync('get-historic');
    if (isErrorMsg(historic)) {
      enqueueSnackbar(historic.msg, { variant: 'error' });
    } else {
      setGridData(historic);
    }
  };

  const getProviders = () => {
    const providers: Provider[] | ErrorMsg = ipcRenderer.sendSync('get-providers');
    if (isErrorMsg(providers)) {
      enqueueSnackbar(providers.msg, { variant: 'error' });
    } else {
      setProviders(providers);
    }
  };

  const saveNotificationRate = () => {
    setSavingNotificationRate(true);
    const newTimer = new Timer();
    newTimer.notification_rate = notificationRate === '' ? 0 : notificationRate;
    const responseTimer: Timer | ErrorMsg = ipcRenderer.sendSync('set-timer', newTimer);

    if (isErrorMsg(responseTimer)) {
      enqueueSnackbar(responseTimer.msg, { variant: 'error' });
    } else {
      setNotificationRate(responseTimer.notification_rate);
      enqueueSnackbar(`Time updated succesfully to ${responseTimer.notification_rate}`, { variant: 'success' });
    }
    setSavingNotificationRate(false);
  };

  const openNewProvider = () => {
    const np = new Provider();
    np.name = '';
    np.open = false;
    np.slider_min = 0;
    np.slider_max = 1000;
    np.status = false;
    np.value_route = '';
    np.endpoint = '';
    np.step = 1;
    np.value_to_notify = 1000;

    setNewProvider(np);
    setIsAddingNew(true);
  };

  const cancelCreating = () => {
    setIsAddingNew(false);
  };

  const saveNewProvider = async (preferences: PreferencesProps) => {
    setSavingNewProvider(true);
    try {
      const response = await fetch(preferences.endpoint, { method: 'GET', redirect: 'follow' });
      const json = await response.json();
      const { value, stopper } = traverse(json, preferences.value_route);
      if (value !== -1 && !stopper) {
        enqueueSnackbar(`Succes, current price is: ${value}`, { variant: 'success' });
      } else {
        enqueueSnackbar(`Warning for the path: ${stopper}`, { variant: 'warning' });
      }
    } catch (e) {
      enqueueSnackbar('Error while fetching the endpoint', { variant: 'error' });
      setSavingNewProvider(false);
      return;
    }

    // this means everything is ok we can save it
    const np = new Provider();
    np.name = preferences.name;
    np.slider_min = preferences.min;
    np.slider_max = preferences.max;
    np.step = preferences.step;
    np.endpoint = preferences.endpoint;
    np.value_route = preferences.value_route;
    np.open = false;
    np.status = false;
    np.value_to_notify = (preferences.min + preferences.max) / 2;

    const responseSave: Provider | ErrorMsg = ipcRenderer.sendSync('set-provider', np);
    if (isErrorMsg(responseSave)) {
      enqueueSnackbar(responseSave.msg, { variant: 'error' });
    } else {
      enqueueSnackbar(`Provider ${np.name} created successfully`, { variant: 'success' });
    }
    getProviders();
    setSavingNewProvider(false);
    setIsAddingNew(false);
  };

  const ButtonAddNew = (
    <Button variant="outlined" classes={buttonClassesObj} size="large" fullWidth onClick={openNewProvider}>
      Add new Provider
    </Button>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Prices Notifier</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.mainDiv}>
        <Container>
          <Grid spacing={4} container justify="center">
            <Grid item xs={false} sm={1} md={2} lg={3} />
            <Grid item sm={8} md={8} lg={6}>
              <List
                subheader={
                  <ListSubheader className={classes.subheader}>
                    <Typography className={classes.title} variant="h5">
                      Tickers
                    </Typography>

                    <IconButton component="span" onClick={() => toggleTimeConfig(!timerConfig)}>
                      <Settings />
                    </IconButton>
                  </ListSubheader>
                }
              >
                <Collapse in={timerConfig} timeout="auto" unmountOnExit>
                  <FormControl className={classes.form} fullWidth variant="outlined" disabled={savingNotificationRate}>
                    <InputLabel>Price update time (ms)</InputLabel>
                    <OutlinedInput
                      labelWidth={165}
                      type="number"
                      value={notificationRate}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const finalVal = isNaN(val) ? '' : val;
                        setNotificationRate(finalVal);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={saveNotificationRate} disabled={savingNotificationRate}>
                            <Save />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Collapse>
                {providers.map((provider) => (
                  <ProviderSelector key={provider.id} provider={provider} getProviders={getProviders} />
                ))}
              </List>
              {!isAddingNew ? (
                ButtonAddNew
              ) : (
                <Preferences
                  name={newProvider.name}
                  min={newProvider.slider_min}
                  max={newProvider.slider_max}
                  step={newProvider.step}
                  endpoint={newProvider.endpoint}
                  value_route={newProvider.value_route}
                  disabled={savingNewProvider}
                  savePreferences={saveNewProvider}
                  deleteProvider={cancelCreating}
                  showDelete={false}
                />
              )}
            </Grid>
            <Grid item xs={false} sm={1} md={2} lg={3} />

            <HistoricTable data={gridData} />
          </Grid>
        </Container>
      </div>
    </>
  );
};
