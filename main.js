const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,      // No OS chrome/title bar
    resizable: false,
    webPreferences: {
      nodeIntegration: false,  // Disable Node integration for security
      contextIsolation: true   // Enable context isolation
    }
  });

  win.loadFile('index.html');
  
  // Optionally, open DevTools:
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
