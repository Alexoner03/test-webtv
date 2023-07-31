import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { app, protocol, BrowserWindow } from 'electron'
import network from 'network'

const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow()
{
  const win = new BrowserWindow({
    width: 800,
    height: 650,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  win.setMenu(null);
  win.setTitle(require('../package.json').productName);

  win.on('page-title-updated', function(e) {
    e.preventDefault()
  });

  win.once('ready-to-show', () => {
    win.maximize();
    win.show();
  });

  win.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    require('open')(url);
  });

  win.webContents.on('will-navigate', (e, url) => {
    if (url !== contents.getURL()) e.preventDefault(), require('open')(url);
  });

  network.get_active_interface(function(err, obj)
  {
    const strmac = obj.mac_address.replace(/:/g, "");
    const sover  = process.platform == 'darwin' ? require('os').release() : '20';

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'?mac='+strmac+'&sover='+sover)
      if (!process.env.IS_TEST) win.webContents.openDevTools()
    } 
    else {
      createProtocol('app')
      win.loadURL('app://./index.html?mac='+strmac+'&sover='+sover)
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
