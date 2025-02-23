export const getAvailablePorts = async () => {
    if (window.electron && window.electron.getPorts) {
        return await window.electron.getPorts();
    } else {
        console.warn("Electron API not available");
        return [];
    }
};

export const connectToModbus = async (port) => {
    if (window.electron && window.electron.connectModbus) {
        return await window.electron.connectModbus(port);
    } else {
        console.warn("Electron API not available");
        return { success: false, error: "Electron API not found" };
    }
};
