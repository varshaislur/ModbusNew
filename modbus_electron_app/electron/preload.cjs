const { contextBridge, ipcRenderer } = require("electron");

console.log("✅ Preload script loaded!");

contextBridge.exposeInMainWorld("electron", {
    getPorts: async () => await ipcRenderer.invoke("get-ports"),
    connectModbus: async (port) => await ipcRenderer.invoke("connect-modbus", port),
});
