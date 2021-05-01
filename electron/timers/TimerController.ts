type cbFn = (...args: any[]) => any;
type ClockShopObj = {
  countInterval?: NodeJS.Timeout;
  isInterval: boolean;
  msRun: number;
  secondsLeft: () => number;
  timeout: NodeJS.Timeout;
  wait: number;
  secondsRun?: number;
};
type ClockShop = {
  [key: string]: ClockShopObj;
};

export class TimerController {
  private clockShop: ClockShop = {};
  private idleJobs: number = 0;
  private completedJobs: number = 0;

  clockFired(id: string) {
    if (!this.clockShop[id].isInterval) {
      this.clear(id);
    }
  }

  timeout(fn: cbFn, wait: number, id: string) {
    if (id === undefined || id === '') {
      console.error('You must specify a valid id when calling wind.');
      return;
    }
    if (this.clockShop[id] !== undefined) {
      console.warn('This id already has a clock associated with it.');
      return;
    }

    const timeout = setTimeout(() => {
      fn();
      this.clockFired(id);
    }, wait);

    const secondsLeft = () => {
      var timeLeft = this.clockShop[id].wait - this.clockShop[id].msRun;
      if (timeLeft < 0) {
        timeLeft = 0;
      }
      return timeLeft / 1000;
    };

    const clock: ClockShopObj = {
      wait,
      msRun: 0,
      isInterval: false,
      timeout,
      secondsLeft,
    };

    this.clockShop[id] = clock;

    this.idleJobs += 1;
  }

  interval(fn: cbFn, wait: number, id: string) {
    if (id === undefined || id === '') {
      console.error('You must specify a valid id when calling windInterval.');
      return;
    }
    if (this.clockShop[id] !== undefined) {
      console.warn('This id already has a clock associated with it.');
      return;
    }

    const timeout = setInterval(() => {
      this.clockShop[id].msRun = 0;
      fn();
      this.clockFired(id);
    }, wait);

    const countInterval = setInterval(() => {
      this.clockShop[id].msRun += 1000;
    }, 1000);

    const secondsLeft = () => {
      var timeLeft = this.clockShop[id].wait - this.clockShop[id].msRun;
      if (timeLeft < 0) {
        timeLeft = 0;
      }
      return timeLeft / 1000;
    };

    const clock: ClockShopObj = {
      wait,
      msRun: 0,
      isInterval: true,
      timeout,
      countInterval,
      secondsLeft,
    };
    this.clockShop[id] = clock;

    this.idleJobs += 1;
  }

  secondsLeft(id: string) {
    if (this.clockShop[id] !== undefined) {
      return this.clockShop[id].secondsLeft();
    }
    return 0;
  }

  clear(id: string) {
    if (this.clockShop[id] === undefined) {
      console.warn('Undefined id passed into clock. The timeout has either been fired or was not wound.');
    } else {
      if (this.clockShop[id].isInterval) {
        clearInterval(this.clockShop[id].timeout);
      } else {
        clearTimeout(this.clockShop[id].timeout);
      }
      const countInterval = this.clockShop[id].countInterval;
      if (countInterval) {
        clearInterval(countInterval);
      }
      this.idleJobs -= 1;
      this.completedJobs += 1;
      delete this.clockShop[id];
    }
  }

  numTicking() {
    return this.idleJobs;
  }

  numComplete() {
    return this.completedJobs;
  }

  clearAll() {
    Object.keys(this.clockShop).forEach((id) => {
      this.clear(id);
    });
  }
}

export const TimerControllerSing = new TimerController();
