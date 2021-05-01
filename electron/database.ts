import { Historic } from '../src/model/historic/historic.schema';
import { Provider } from '../src/model/provider/provider.schema';
import { Timer } from '../src/model/timer/timer.schema';
import { ConnectionOptions } from 'typeorm';

export const dbConfiguration: ConnectionOptions = {
  type: 'better-sqlite3',
  database: './public/db.sqlite3',
  synchronize: true,
  logging: false,
  logger: 'simple-console',
  entities: [Provider, Historic, Timer],
};
