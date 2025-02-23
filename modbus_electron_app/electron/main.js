const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const isDev = require("electron-is-dev");
const axios = require("axios");

let mainWindow;
let backendProcess;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false
        }
    });

    const frontendURL = isDev ? "http://localhost:5173" : `file://${path.join(__dirname, "../frontend/dist/index.html")}`;
    mainWindow.loadURL(frontendURL);

    if (!isDev) {
        backendProcess = spawn("node", [path.join(__dirname, "../backend/index.js")], {
            stdio: "ignore",
            detached: true
        });
        backendProcess.unref();
    }
});

// IPC to get available COM ports
ipcMain.handle("get-ports", async () => {
    try {
        const response = await axios.get("http://localhost:5000/ports");
        return response.data.ports;
    } catch (error) {
        return [];
    }
});

// IPC to connect to Modbus
ipcMain.handle("connect-modbus", async (event, port) => {
    try {
        const response = await axios.post("http://localhost:5000/connect", { port });
        return response.data;
    } catch (error) {
        return { error: "Failed to connect to Modbus" };
    }
});

app.on("window-all-closed", () => {
    if (backendProcess) backendProcess.kill();
    app.quit();
});
