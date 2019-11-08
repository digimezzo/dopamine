import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as windowStateKeeper from 'electron-window-state';

// Logging needs to be imported in main.ts also. Otherwise it just doesn't work anywhere else.
// See post by megahertz: https://github.com/megahertz/electron-log/issues/60
// "You need to import electron-log in the main process. Without it, electron-log doesn't works in a renderer process."
import log from 'electron-log';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Load the previous state with fallback to defaults
  let windowState = windowStateKeeper({
    defaultWidth: 850,
    defaultHeight: 600
  });

  // Create the browser window.
  win = new BrowserWindow({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    backgroundColor: '#fff',
    frame: false,
    icon: path.join(__dirname, 'build/icon/icon.png'),
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  windowState.manage(win);

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    // win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // 'ready-to-show' doesn't fire on Windows in dev mode. In prod it seems to work. 
  // See: https://github.com/electron/electron/issues/7779
  win.on('ready-to-show', function () {
    win.show();
    win.focus();
  });

  // Makes links open in external browser
  var handleRedirect = (e, url) => {
    // Check that the requested url is not the current page
    if (url != win.webContents.getURL()) {
      e.preventDefault()
      require('electron').shell.openExternal(url)
    }
  }

  win.webContents.on('will-navigate', handleRedirect)
  win.webContents.on('new-window', handleRedirect)
}

try {
  log.info("[Main] [] +++ Starting +++");

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    log.info("[App] [window-all-closed] +++ Stopping +++");
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
