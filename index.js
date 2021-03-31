const { app, BrowserWindow, ipcMain, ipcRenderer, } = require('electron')
const { Client, Authenticator } = require('minecraft-launcher-core')
const path = require('path')
const launcher = new Client()
let appdata = app.getPath("appData")

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    title: "Example Launcher | Minecraft",
    icon: path.join(__dirname, "/assets/img/arkadium.ico"),
    autoHideMenuBar: true,
    minWidth: 1000,
    minHeight: 700,
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadFile(path.join(__dirname, "index.html"))
  win.webContents.openDevTools()
  ipcMain.on("login", (event, data) => {

    Authenticator.getAuth(data.u, data.p).then(() => {
      event.sender.send("done")
      win.loadFile(path.join(__dirname, "./app.html"))
      let opts = {
          clientPackage: "http://bobsonic.com/m.zip",  
          authorization: Authenticator.getAuth(data.u, data.p),
          root: appdata + "/.example",
          version: {
              number: "1.16.5",
              type: "release"
          },
          forge: appdata + "/.example/forge.jar",
          memory: {
              max: "6000",
              min: "4000"
          }
      }
      
      ipcMain.on("launch", () => {
        console.log(root);
        launcher.launch(opts);
      
        launcher.on('debug', (e) => console.log(e));
        launcher.on('data', (e) => console.log(e));
        launcher.on('debug', (e) => {
          event.sender.send("debug", e)
        })
      })

    }).catch((err) => {
      event.sender.send("err", { er: err })
    })
  })
}

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})    
