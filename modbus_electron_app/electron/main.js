import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import axios from "axios";
import isDev from "electron-is-dev";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let backendProcess;
console.log("Preload script path:", path.join(__dirname, "preload.cjs"));

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.resolve(__dirname, "preload.cjs"), // ✅ Ensure absolute path
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        sandbox: false,
        }
    });

    const frontendURL = isDev
        ? "http://localhost:5173"
        : `file://${path.join(__dirname, "../frontend/dist/index.html")}`;

    mainWindow.loadURL(frontendURL);

    if (isDev) {
        backendProcess = spawn("node", ["backend/index.js"], { stdio: "inherit" });
    } else {
        backendProcess = spawn("node", [path.join(__dirname, "../backend/index.js")], {
            stdio: "ignore",
            detached: true
        });
        backendProcess.unref();
    }
});

ipcMain.handle("get-ports", async () => {
    console.log("🟡 Fetching COM ports...");
    try {
        const response = await axios.get("http://localhost:5000/ports");
        console.log("🟢 Ports received:", response.data);
        return response.data.ports;
    } catch (error) {
        console.error("❌ Error fetching ports:", error.message);
        return [];
    }
});

ipcMain.handle("connect-modbus", async (event, port) => {
    console.log(`🔌 Connecting to ${port}...`);
    try {
        const response = await axios.post("http://localhost:5000/connect", { port });
        console.log("🟢 Modbus connection response:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Modbus connection error:", error.message);
        return { error: "Failed to connect to Modbus" };
    }
});


// 🛠️ Fix: Ensure the backend process is properly terminated when all windows close
app.on("window-all-closed", () => {
    if (backendProcess) backendProcess.kill();
    app.quit();
});
