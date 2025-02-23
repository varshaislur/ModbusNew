const express = require("express");
const cors = require("cors");
const { SerialPort } = require("serialport"); // Import SerialPort
const { connectModbus } = require("./modbusHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Get available COM ports
app.get("/ports", async (req, res) => {
    try {
        const ports = await SerialPort.list();
        const portNames = ports.map((port) => port.path);
        res.json({ success: true, ports: portNames });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve COM ports" });
    }
});

// Connect to Modbus
app.post("/connect", async (req, res) => {
    const { port } = req.body;
    if (!port) return res.status(400).json({ error: "Port is required" });

    const data = await connectModbus(port);
    if (data) {
        res.json({ success: true, data });
    } else {
        res.status(500).json({ error: "Failed to read Modbus registers" });
    }
});

// Start backend server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
