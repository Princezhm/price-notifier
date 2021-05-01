import {
  CircularProgress,
  Collapse,
  createStyles,
  debounce,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Mark,
  Switch,
  Theme,
  Modal,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useSnackbar } from 'notistack';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ErrorMsg } from '../../typings/error.type';
import { Provider } from '../../model/provider/provider.schema';
import { isErrorMsg, traverse } from '../../utils/utils';
import { Preferences, PreferencesProps } from '../preferences/Preferences';
import { PriceSelector } from '../price-selector/PriceSelector';
const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.error.light,
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    focusVisible: {},
    checked: {},
    disabled: {
      color: '#d4d4d4 !important',
      '&$checked': {
        '& + $track': {
          backgroundColor: '#7d7d7d',
        },
      },
    },
    top: {
      color: '#52d869',
    },
  })
);
type onGetproviders = () => void;

type ProviderSelectorProps = {
  provider: Provider;
  getProviders: onGetproviders;
};

export const ProviderSelector = ({ provider, getProviders }: ProviderSelectorProps) => {
  const classes = useStyles();
  const { status: checked, name: label } = provider;

  const [open, toggleOpen] = useState(false);
  const [settingPrice, setSettingPrice] = useState<boolean>(false);
  const [savingPreferences, setSavingPreferences] = useState<boolean>(false);
  const [marks, setMarks] = useState<Mark[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setSettingPrice(true);
    const newMarks = [
      {
        value: provider.slider_min,
        label: `$${provider.slider_min}`,
      },
      {
        value: provider.slider_max,
        label: `$${provider.slider_max}`,
      },
    ];

    // doStuff to get the current price mark

    const half = (provider.slider_max + provider.slider_min) / 2;
    newMarks.push({
      value: half,
      label: `$${half}`,
    });
    setMarks(newMarks);
    setSettingPrice(false);
    toggleOpen(provider.open);
  }, []);

  useEffect(() => {
    setSettingPrice(true);
    const newMarks = [
      {
        value: provider.slider_min,
        label: `$${provider.slider_min}`,
      },
      {
        value: provider.slider_max,
        label: `$${provider.slider_max}`,
      },
    ];

    // doStuff to get the current price mark

    const half = (provider.slider_max + provider.slider_min) / 2;
    newMarks.push({
      value: half,
      label: `$${half}`,
    });
    setMarks(newMarks);
    setSettingPrice(false);
    toggleOpen(provider.open);
  }, [provider.slider_min, provider.slider_max, provider.step, provider.value_to_notify]);

  const getLabelText = () => {
    return `${label} (set in: $${provider.value_to_notify})`;
  };

  // debounce functions
  const debouncedSetPrice = debounce((price: number) => {
    setSettingPrice(true);

    // this means everything is ok we can save it
    const np = new Provider();
    np.id = provider.id;
    np.name = provider.name;
    np.slider_min = provider.slider_min;
    np.slider_max = provider.slider_max;
    np.step = provider.step;
    np.endpoint = provider.endpoint;
    np.value_route = provider.value_route;
    np.open = false;
    np.status = provider.status;
    np.value_to_notify = price;

    const responseSave: Provider | ErrorMsg = ipcRenderer.sendSync('set-provider', np);
    if (isErrorMsg(responseSave)) {
      enqueueSnackbar(responseSave.msg, { variant: 'error' });
    } else {
      enqueueSnackbar(`Notify price for ${np.name} was updated successfully`, { variant: 'success' });
    }

    getProviders();
    toggleOpen(false);
    setSettingPrice(false);
  }, 500);

  // internal functions of the app to be debounced
  const setPrice = (event: ChangeEvent<{}>, value: number | number[]) => {
    if (typeof value === 'number') {
      debouncedSetPrice(value);
    }
  };

  const savePreferences = async (preferences: PreferencesProps) => {
    setSavingPreferences(true);
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
      setSavingPreferences(false);
      return;
    }

    // this means everything is ok we can save it
    const np = new Provider();
    np.id = provider.id;
    np.name = preferences.name;
    np.slider_min = preferences.min;
    np.slider_max = preferences.max;
    np.step = preferences.step;
    np.endpoint = preferences.endpoint;
    np.value_route = preferences.value_route;
    np.open = false;
    np.status = provider.status;
    np.value_to_notify = provider.value_to_notify;

    const responseSave: Provider | ErrorMsg = ipcRenderer.sendSync('set-provider', np);
    if (isErrorMsg(responseSave)) {
      enqueueSnackbar(responseSave.msg, { variant: 'error' });
    } else {
      enqueueSnackbar(`Provider ${np.name} updated successfully`, { variant: 'success' });
    }

    getProviders();
    toggleOpen(false);
    setSavingPreferences(false);
  };

  const turnOnNotifications = () => {
    setSettingPrice(true);
    const responseSave: Provider | ErrorMsg = ipcRenderer.sendSync('set-status', { status: !checked, id: provider.id });
    if (isErrorMsg(responseSave)) {
      enqueueSnackbar(responseSave.msg, { variant: 'error' });
    } else {
      enqueueSnackbar(`Notifications for ${provider.name} updated successfully`, { variant: 'success' });
    }

    setSettingPrice(false);
    getProviders();
  };

  const deleteProvider = async () => {
    setSavingPreferences(true);
    const result: any | ErrorMsg = ipcRenderer.sendSync('delete-provider', provider.id);
    if (isErrorMsg(result)) {
      enqueueSnackbar(`the provider ${provider.name} was sucessfully deleted`, { variant: 'success' });
      getProviders();
    } else {
      enqueueSnackbar(`the provider ${provider.name} was not deleted`, { variant: 'error' });
    }
    setSavingPreferences(false);
  };

  return (
    <>
      <ListItem>
        <ListItemText primary={getLabelText()} />
        <ListItemIcon>
          {settingPrice ? <CircularProgress className={classes.top} variant="indeterminate" size={30} thickness={4} value={100} /> : null}
        </ListItemIcon>
        <ListItemIcon>
          <Switch
            disabled={settingPrice}
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
              root: classes.root,
              switchBase: classes.switchBase,
              thumb: classes.thumb,
              track: classes.track,
              checked: classes.checked,
              disabled: classes.disabled,
            }}
            checked={checked}
            onClick={turnOnNotifications}
            edge="end"
          />
        </ListItemIcon>
        <ListItemSecondaryAction>
          {open ? (
            <ExpandLess onClick={() => (settingPrice ? null : toggleOpen(false))} />
          ) : (
            <ExpandMore onClick={() => (settingPrice ? null : toggleOpen(true))} />
          )}
        </ListItemSecondaryAction>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <PriceSelector
          setPrice={setPrice}
          marks={marks}
          price={provider.value_to_notify}
          min={provider.slider_min}
          max={provider.slider_max}
          step={provider.step}
          settingPrice={settingPrice}
        />
        <Preferences
          name={provider.name}
          min={provider.slider_min}
          max={provider.slider_max}
          step={provider.step}
          endpoint={provider.endpoint}
          value_route={provider.value_route}
          disabled={savingPreferences}
          savePreferences={savePreferences}
          deleteProvider={deleteProvider}
          showDelete={true}
        />
      </Collapse>
    </>
  );
};
