import { useState, useEffect } from "react";
import { getAvailablePorts, connectToModbus } from "./api";

function App() {
    const [ports, setPorts] = useState([]);
    const [selectedPort, setSelectedPort] = useState("");
    const [registerData, setRegisterData] = useState(null);

    // Fetch available COM ports when the component loads
    useEffect(() => {
        async function fetchPorts() {
            const availablePorts = await getAvailablePorts();
            setPorts(availablePorts);
            if (availablePorts.length > 0) {
                setSelectedPort(availablePorts[0]);
            }
        }
        fetchPorts();
    }, []);

    const handleConnect = async () => {
        if (!selectedPort) {
            alert("No COM ports available.");
            return;
        }

        const result = await connectToModbus(selectedPort);
        if (result.success) {
            setRegisterData(result.data);
        } else {
            alert(result.error || "Failed to fetch Modbus data");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Modbus RTU Reader</h1>

            <label>Select COM Port:</label>
            <select value={selectedPort} onChange={(e) => setSelectedPort(e.target.value)}>
                {ports.length > 0 ? (
                    ports.map((port) => <option key={port} value={port}>{port}</option>)
                ) : (
                    <option disabled>No COM ports found</option>
                )}
            </select>

            <button onClick={handleConnect} disabled={!selectedPort}>Connect</button>

            {registerData && (
                <div>
                    <h2>Register Data</h2>
                    <pre>{JSON.stringify(registerData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default App;
