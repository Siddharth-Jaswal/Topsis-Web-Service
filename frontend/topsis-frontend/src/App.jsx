import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [weights, setWeights] = useState("");
  const [impacts, setImpacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultFile, setResultFile] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultFile("");

    if (!file || !weights || !impacts) {
      setError("Please provide CSV file, weights, and impacts.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weights", weights);
    formData.append("impacts", impacts);

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/api/topsis/run", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setResultFile(data.result_file);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.location.href =
      `http://127.0.0.1:5000/api/topsis/download/${resultFile}`;
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

      {resultFile && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Result Ready</h3>
          <button onClick={handleDownload}>
            Download Result CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
