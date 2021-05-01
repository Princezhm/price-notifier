import { ipcMain } from 'electron';
import { Historic } from '../../src/model/historic/historic.schema';
import { ErrorMsg } from '../../src/typings/error.type';

ipcMain.on('get-historic', async (event: any, ...args: any[]) => {
  try {
    event.returnValue = await Historic.find({
      order: {
        id: 'DESC',
      },
    });
  } catch (err) {
    const error: ErrorMsg = {
      type: 'ipc',
      msg: 'Error getting the historic of prices',
      trace: err,
    };

    event.returnValue = error;
  }
});
