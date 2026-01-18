import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [weights, setWeights] = useState("");
  const [impacts, setImpacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!file || !weights || !impacts) {
      setError("Please provide CSV file, weights, and impacts.");
      return;
    }

    // Backend call will be added in next stage
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>TOPSIS Web Tool</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>CSV File</label><br />
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Weights (comma-separated)</label><br />
          <input
            type="text"
            placeholder="1,1,1"
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Impacts (comma-separated)</label><br />
          <input
            type="text"
            placeholder="+,+,-"
            value={impacts}
            onChange={(e) => setImpacts(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Run TOPSIS"}
        </button>
      </form>
    </div>
  );
}

export default App;
