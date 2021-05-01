import { app, BrowserWindow, Menu, NativeImage, nativeImage, Tray } from 'electron';
import { createConnection } from 'typeorm';
import path from 'path';
import { dbConfiguration } from './database';
import { TrayMenu } from './menu/menu';
import './handlers';
import os from 'os';
import { TimersSing } from './timers/Timers';

declare const MAIN_WINDOW_WEBPACK_ENTRY: any; // eslint-disable-line @typescript-eslint/no-explicit-any

const platforms = {
  WINDOWS: 'WINDOWS',
  MAC: 'MAC',
  LINUX: 'LINUX',
};

const platformsNames = {
  win32: platforms.WINDOWS,
  darwin: platforms.MAC,
  linux: platforms.LINUX,
};

type osType = 'win32' | 'darwin' | 'linux';
const plat: osType = os.platform() as osType;
const currentPlatform = platformsNames[plat];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

if (currentPlatform === platforms.WINDOWS) {
  app.setAppUserModelId(process.execPath);
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  return mainWindow;
};
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray;
app.on('ready', async () => {
  await createConnection(dbConfiguration);
  tray = new TrayMenu(app, createWindow);

  await TimersSing.build();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  switch (currentPlatform) {
    case platforms.MAC: {
      app.dock.hide();
      break;
    }
    case platforms.WINDOWS: {
      break;
    }
    case platforms.LINUX: {
      break;
    }
    default: {
      app.quit();
      break;
    }
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
