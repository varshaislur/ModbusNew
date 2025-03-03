import ModbusRTU from "modbus-serial";
const client = new ModbusRTU();

export async function connectModbus(port) {
    try {
        await client.connectRTUBuffered(port, { baudRate: 9600 });
        console.log(`Connected to ${port}`);
        client.setID(13);
        const data = await client.readInputRegisters(0, 5);
        console.log("Register Data:", data.data);
        return data.data;
    } catch (error) {
        console.error("Modbus Error:", error);
        return null;
    }
}
