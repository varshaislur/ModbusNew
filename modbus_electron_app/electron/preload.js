const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    getPorts: () => ipcRenderer.invoke("get-ports"),
    connectModbus: (port) => ipcRenderer.invoke("connect-modbus", port)
});
