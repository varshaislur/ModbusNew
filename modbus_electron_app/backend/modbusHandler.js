const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

async function connectModbus(port) {
    try {
        // Connect to the selected Modbus port
        await client.connectRTUBuffered(port, { baudRate: 9600 });
        console.log(`Connected to ${port}`);

        // Set Modbus slave ID (change if needed)
        client.setID(13);

        // Read 5 input registers starting from address 0
        const data = await client.readInputRegisters(0, 5);
        console.log("Register Data:", data.data);
        return data.data;
    } catch (error) {
        console.error("Modbus Error:", error);
        return null;
    }
}

module.exports = { connectModbus };
