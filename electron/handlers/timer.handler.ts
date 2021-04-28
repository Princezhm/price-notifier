import { ipcMain } from 'electron';
import { create } from 'lodash';
import { getConnection } from 'typeorm';
import { Timer } from '../../src/model/timer/timer.schema';
import { ErrorMsg } from '../../src/typings/error.type';

ipcMain.on('set-timer', async (event: any, timer: Timer) => {
  try {
    const created = await Timer.create(timer);
    event.returnValue = await created.save();
  } catch (err) {
    const error: ErrorMsg = {
      type: 'ipc',
      msg: 'Error setting the new timer',
      trace: err,
    };

    event.returnValue = error;
  }
});

ipcMain.on('get-timer', async (event: any, ...args: any[]) => {
  try {
    const result = await getConnection().createQueryBuilder().select('timer').from(Timer, 'timer').orderBy('timer.id', 'DESC').getOne();
    if (!result) {
      const newTimer = new Timer();
      newTimer.notification_rate = 0;
      const created = await Timer.create(newTimer);
      event.returnValue = await created.save();
    } else {
      event.returnValue = result;
    }
  } catch (err) {
    const error: ErrorMsg = {
      type: 'ipc',
      msg: 'Error getting the timer... I would reset the app LOL',
      trace: err,
    };

    event.returnValue = error;
  }
});
