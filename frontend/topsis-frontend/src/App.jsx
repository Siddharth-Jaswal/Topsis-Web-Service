import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [weights, setWeights] = useState("");
  const [impacts, setImpacts] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultFile, setResultFile] = useState("");

  const parseCSV = async (file) => {
    const text = await file.text();
    const clean = text.replace(/\ufeff/g, "").trim();

    const rows = clean
      .split(/\r?\n/)
      .map((row) => row.split(",").map((c) => c.trim()))
      .filter((row) => row.length > 1);

    if (rows.length < 2) {
      throw new Error("CSV file has no data rows");
    }

    return rows;
  };

  const validateInputs = async () => {
    if (!file) {
      throw new Error("CSV file is required");
    }

    const rows = await parseCSV(file);

    if (rows[0].length < 3) {
      throw new Error("CSV must contain at least 3 columns");
    }

    const criteriaCount = rows[0].length - 1;

    const weightArr = weights.split(",").map((w) => w.trim());
    const impactArr = impacts.split(",").map((i) => i.trim());

    if (weightArr.length !== criteriaCount) {
      throw new Error("Number of weights must match criteria count");
    }

    if (impactArr.length !== criteriaCount) {
      throw new Error("Number of impacts must match criteria count");
    }

    if (!weightArr.every((w) => w !== "" && !isNaN(w))) {
      throw new Error("Weights must be numeric and comma-separated");
    }

    if (!impactArr.every((i) => i === "+" || i === "-")) {
      throw new Error("Impacts must be either + or -");
    }

    for (let i = 1; i < rows.length; i++) {
      for (let j = 1; j < rows[i].length; j++) {
        if (rows[i][j] === "" || isNaN(rows[i][j])) {
          throw new Error(
            `Non-numeric value found at row ${i + 1}, column ${j + 1}`
          );
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultFile("");

    try {
      setLoading(true);
      await validateInputs();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("weights", weights);
      formData.append("impacts", impacts);

      const res = await fetch("/api/topsis/run", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Server error");
      }

      setResultFile(data.result_file);
    } catch (err) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>TOPSIS Analyzer</h1>
      <p className="subtitle">Multi-Criteria Decision Making Tool</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Weights (e.g. 1,1,1)</label>
          <input
            type="text"
            value={weights}
            onChange={(e) => setWeights(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Impacts (e.g. +,+,-)</label>
          <input
            type="text"
            value={impacts}
            onChange={(e) => setImpacts(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing…" : "Run TOPSIS"}
        </button>
      </form>

      {resultFile && (
        <div className="success">
          Result ready
          <button
            className="download-btn"
            onClick={() =>
              (window.location.href =
                `/api/topsis/download/${resultFile}`)
            }
          >
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
