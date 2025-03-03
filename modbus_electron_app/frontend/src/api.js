export const getAvailablePorts = async () => {
    try {
        if (window.electron && window.electron.getPorts) {
            const ports = await window.electron.getPorts();
            return ports || []; // Ensure we return an array
        } else {
            console.warn("⚠️ Electron API not available");
            return [];
        }
    } catch (error) {
        console.error("⚠️ Error fetching ports:", error);
        return [];
    }
};

export const connectToModbus = async (port) => {
    try {
        if (window.electron && window.electron.connectModbus) {
            return await window.electron.connectModbus(port);
        } else {
            console.warn("⚠️ Electron API not available");
            return { success: false, error: "Electron API not found" };
        }
    } catch (error) {
        console.error("⚠️ Error connecting to Modbus:", error);
        return { success: false, error: "Connection error" };
    }
};