import { ipcMain } from 'electron';
import { getConnection } from 'typeorm';
import { Provider } from '../../src/model/provider/provider.schema';
import { ErrorMsg } from '../../src/typings/error.type';

ipcMain.on('set-provider', async (event: any, provider: Provider) => {
  try {
    event.returnValue = await Provider.create(provider).save();
  } catch (err) {
    const error: ErrorMsg = {
      type: 'ipc',
      msg: 'Error creating the provider.',
      trace: err,
    };

    event.returnValue = error;
  }
});

ipcMain.on('set-status', async (event: any, { id, status }) => {
  try {
    console.log({ id, status });
    const res = await getConnection().createQueryBuilder().update(Provider).set({ status }).where('id = :id', { id }).execute();
    event.returnValue = res;
  } catch (err) {
    const error: ErrorMsg = {
      type: 'ipc',
      msg: 'Error updating the status',
      trace: err,
    };

    event.returnValue = error;
  }
});

ipcMain.on('get-providers', async (event: any, ...args: any[]) => {
  try {
    event.returnValue = await Provider.find();
  } catch (err) {
    const error: ErrorMsg = {
      type: 'ipc',
      msg: 'Error getting the providers of prices',
      trace: err,
    };

    event.returnValue = error;
  }
});
