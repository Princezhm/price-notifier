import { BrowserWindow, Menu, nativeImage, NativeImage, Tray, app } from 'electron';
import path from 'path';

export class TrayMenu {
  // Create a variable to store our tray
  // Public: Make it accessible outside of the class;
  // Readonly: Value can't be changed
  public tray: Tray;
  private app;
  private createWindow;
  private mainWindow;

  // Path where should we fetch our icon;
  private iconPath: string = path.join(__dirname, '/assets/tray_icon.png');

  constructor(app: any, createWindow: any) {
    this.createMenu = this.createMenu.bind(this);

    this.app = app;
    this.createWindow = createWindow;
    this.mainWindow = this.createWindow();
    this.tray = new Tray(this.createNativeImage());
    this.tray.on('click', this.createMenu);
  }

  createTray() {
    this.tray = new Tray(this.createNativeImage());
    this.tray.on('click', this.createMenu);
  }

  createNativeImage() {
    const image: NativeImage = nativeImage.createFromPath(this.iconPath);
    image.setTemplateImage(true);
    return image.resize({ width: 16 });
  }

  createMenu() {
    const isOpen = BrowserWindow.getAllWindows().length > 0;
    const contextMenu = Menu.buildFromTemplate([
      {
        label: isOpen ? 'Show App' : 'Open App',
        click: () => {
          if (isOpen) {
            this.mainWindow.show();
          } else {
            app.dock.show();
            this.mainWindow = this.createWindow();
          }
        },
      },
      {
        label: 'Quit',
        click: () => {
          this.app.quit(); // actually quit the app.
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }
}
