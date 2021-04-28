import { createStyles, Grid, makeStyles, Mark, Slider, Theme } from '@material-ui/core';
import React, { ChangeEvent } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainDiv: {
      display: 'flex',
      padding: theme.spacing(4),
    },
  })
);

const sliderStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: '#52af77',
      height: 8,
    },
    thumb: {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      marginTop: -8,
      marginLeft: -12,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    valueLabel: {
      left: 'calc(-50% + 4px)',
    },
    track: {
      height: 8,
      borderRadius: 4,
    },
    rail: {
      height: 8,
      borderRadius: 4,
    },
    mark: {
      height: 8,
    },
  })
);

type onChangeFn = (event: ChangeEvent<{}>, value: number | number[]) => void;
const defOnChangeFn = (e: ChangeEvent<{}>, n: number | number[]) => {};

type PriceSelectProps = {
  setPrice: onChangeFn;
  marks: Mark[];
  price: number;
  settingPrice: boolean;
  min: number;
  max: number;
  step: number;
};

export const PriceSelector = ({
  setPrice = defOnChangeFn,
  marks = [],
  price = 0,
  settingPrice = false,
  min = 0,
  max = 0,
  step = 0,
}: PriceSelectProps) => {
  const classes = useStyles();
  const sliderClasses = sliderStyles();

  return (
    <div className={classes.mainDiv}>
      <Grid item xs={12}>
        <Slider
          classes={sliderClasses}
          disabled={settingPrice}
          defaultValue={price}
          aria-labelledby="discrete-slider-small-steps"
          step={step}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          onChange={setPrice}
          marks={marks}
        />
      </Grid>
    </div>
  );
};
