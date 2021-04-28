import { Button, Container, createStyles, Grid, makeStyles, Mark, TextField, Theme } from '@material-ui/core';
import { Cancel, DeleteForever, Save } from '@material-ui/icons';
import React, { ChangeEvent, useEffect, useState } from 'react';

const buttonClasses = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderColor: '#52af77',
      '&:focus, &:hover, &$active': {
        backgroundColor: '#65ce8f33',
      },
    },
  })
);

type onSavePreferences = (config: PreferencesProps) => void;
type onDeleteProvider = () => void;
const defOnSavePreferencesFn = (config: PreferencesProps) => {};
const defOnDeleteProviderFn = () => {};

export type PreferencesProps = {
  savePreferences?: onSavePreferences;
  deleteProvider?: onDeleteProvider;
  endpoint: string;
  value_route: string;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  showDelete?: boolean;
  name: string;
};

export const Preferences = ({
  name = '',
  endpoint = '',
  value_route = '',
  min = 0,
  max = 0,
  step = 0,
  disabled = false,
  savePreferences = defOnSavePreferencesFn,
  deleteProvider = defOnDeleteProviderFn,
  showDelete = false,
}: PreferencesProps) => {
  const classes = buttonClasses();

  const [nameState, setName] = useState<string>('');
  const [endpointState, setEndpoint] = useState<string>('');
  const [valueRouteState, setValueRoute] = useState<string>('');
  const [minState, setMin] = useState<number>(0);
  const [maxState, setMax] = useState<number>(0);
  const [stepState, setStep] = useState<number>(0);

  useEffect(() => {
    setName(name);
    setMin(min);
    setMax(max);
    setStep(step);
    setEndpoint(endpoint);
    setValueRoute(value_route);
  }, []);

  const save = () => {
    const preferences: PreferencesProps = {
      name: nameState,
      min: minState,
      max: maxState,
      step: stepState,
      value_route: valueRouteState,
      endpoint: endpointState,
    };
    savePreferences(preferences);
  };

  return (
    <Container>
      <Grid spacing={4} container justify="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name of the provider"
            variant="outlined"
            value={nameState}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Min Price(Slider)"
            variant="outlined"
            type="number"
            value={minState}
            onChange={(e) => setMin(parseInt(e.target.value))}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Max Price(Slider)"
            variant="outlined"
            type="number"
            value={maxState}
            onChange={(e) => setMax(parseInt(e.target.value))}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Step(Slider)"
            variant="outlined"
            type="number"
            value={stepState}
            onChange={(e) => setStep(parseInt(e.target.value))}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Endpoint"
            variant="outlined"
            value={endpointState}
            onChange={(e) => setEndpoint(e.target.value)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Route to Value"
            variant="outlined"
            value={valueRouteState}
            onChange={(e) => setValueRoute(e.target.value)}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" classes={classes} startIcon={<Save />} size="large" fullWidth onClick={save} disabled={disabled}>
            Save
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={showDelete ? <DeleteForever /> : <Cancel />}
            size="large"
            fullWidth
            onClick={deleteProvider}
            disabled={disabled}
          >
            {showDelete ? 'Delete' : 'Cancel'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};
