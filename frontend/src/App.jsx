import { useState } from "react";

function App() {
  const [response, setResponse] = useState(null);

  const callBackend = async () => {
    const res = await fetch("http://localhost:3000/api");
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AWS EC2 Demo</h1>

      <button onClick={callBackend}>Call Backend</button>

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}

export default App;
