import {
  createStyles,
  Grid,
  List,
  ListSubheader,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { Historic } from '../../model/historic/historic.schema';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      paddingTop: theme.spacing(1),
    },
    tableWrapper: {
      maxHeight: 700,
      overflow: 'scroll',
    },
  })
);
const dateFormatter = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

type HistoricTableProps = {
  data: Historic[];
};

export const HistoricTable = ({ data = [] }: HistoricTableProps) => {
  const classes = useStyles();

  const formatDate = (date: Date) => dateFormatter.format(date);

  return (
    <>
      <Grid item xs={false} sm={1} md={2} lg={3} />
      <Grid item sm={8} md={8} lg={6}>
        <List
          subheader={
            <ListSubheader>
              <Typography className={classes.title} variant="h5">
                Historic of prices
              </Typography>
            </ListSubheader>
          }
        ></List>
      </Grid>
      <Grid item xs={false} sm={1} md={2} lg={3} />

      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={false} sm={1} md={2} lg={2} />
        <Grid className={classes.tableWrapper} container item sm={8} md={8} lg={8} direction="row" justify="center">
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Provider</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Notified</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((historic) => (
                  <TableRow key={historic.id}>
                    <TableCell component="th" scope="row">
                      {historic.provider}
                    </TableCell>
                    <TableCell>{formatDate(historic.date)}</TableCell>
                    <TableCell>{historic.notified}</TableCell>
                    <TableCell align="right">${historic.price}</TableCell>
                    <TableCell align="right">{historic.error}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={false} sm={1} md={2} lg={2} />
      </Grid>
    </>
  );
};
