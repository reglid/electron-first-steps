import {app, BrowserWindow, Menu} from "electron";

import * as path from "path";
import * as url from "url";
import {customMenu} from "./menu";
import WebContents = Electron.WebContents;


// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, backgroundColor: "#00DDFF"});

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "../index.html"),
        protocol: "file:",
        slashes: true,
    }));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // prevent navigation to any webpage outside css.ch
    const wcs: WebContents = mainWindow.webContents;
    console.log(wcs);
    wcs.on("will-navigate", (navEvent, navUrl) => {
        console.log("event will-navigate " + navUrl);
        if (!navUrl.match("https?://.*\\.css\\.ch")) {
            console.log("navigate to " + navUrl + "prevented");
            navEvent.preventDefault();
        }
    });

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // Configure the application menu
    Menu.setApplicationMenu(customMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
