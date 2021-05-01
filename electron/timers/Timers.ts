import axios from 'axios';
import { Notification } from 'electron';
import { getConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Historic } from '../../src/model/historic/historic.schema';
import { Provider } from '../../src/model/provider/provider.schema';
import { Timer } from '../../src/model/timer/timer.schema';
import { traverse } from '../../src/utils/utils';
import { TimerControllerSing } from './TimerController';

export class Timers {
  private currentTime: number = 0;
  private currentId: string = '';
  constructor() {}

  async build() {
    await this.getTime();
    this.start();
  }

  async getTime() {
    const result = await getConnection().createQueryBuilder().select('timer').from(Timer, 'timer').orderBy('timer.id', 'DESC').getOne();
    if (result) {
      this.currentTime = result?.notification_rate;
    } else {
      this.currentTime = 0;
    }
  }

  start() {
    if (this.currentTime && this.currentTime !== 0) {
      this.currentId = uuid();
      TimerControllerSing.interval(() => this.showNotifications(), this.currentTime, this.currentId);
    }
  }

  triggerNotification(title: string, body: string) {
    // const notification = {
    //   title,
    //   body,
    // };
    // new Notification(notification).show();
  }

  async getEnabledProviders() {
    const res = await Provider.find();
    return res;
  }

  async saveHistoric(value: number, stopper: string | null, provider: Provider) {
    const newHistoric = new Historic();
    newHistoric.notified = provider.status;
    newHistoric.date = new Date();
    newHistoric.provider = provider.name;
    if (stopper == null) {
      newHistoric.price = value;
      newHistoric.error = '';
    } else {
      newHistoric.error = stopper;
      newHistoric.price = 0;
    }
    await Historic.create(newHistoric).save();
  }

  async singleNotification(provider: Provider) {
    try {
      const response = await axios.get(provider.endpoint);
      const json = response.data;

      const { value, stopper } = traverse(json, provider.value_route);

      if (provider.status) {
        if (stopper) {
          this.triggerNotification(provider.name, `${provider.name} warning, path not working error on: ${stopper}`);
        } else {
          this.triggerNotification(provider.name, `current price is: ${value}`);
        }
      }
      await this.saveHistoric(value, stopper, provider);
    } catch (e) {
      this.triggerNotification('Error', `Error while fetching the endpoint of ${provider.name}`);
      const newHistoric = new Historic();
      newHistoric.notified = false;
      newHistoric.date = new Date();
      newHistoric.provider = provider.name;
      newHistoric.price = 0;
      newHistoric.error = `Error while fetching the endpoint`;
    }
  }

  async showNotifications() {
    try {
      const providers = await this.getEnabledProviders();
      providers.forEach(async (p) => await this.singleNotification(p));
    } catch (e) {
      this.triggerNotification('Error', 'Error Fetching the providers');
    }
  }

  changeTimer(newTime: number) {
    TimerControllerSing.clear(this.currentId);
    this.currentId = '';
    if (newTime > 0) {
      this.currentId = uuid();
      this.currentTime = newTime;
      TimerControllerSing.interval(() => this.showNotifications(), newTime, this.currentId);
    }
  }
}

export const TimersSing = new Timers();
