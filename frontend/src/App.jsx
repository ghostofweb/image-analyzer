import { useState } from "react";
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
  };

  const analyzeImage = async () => {
    if (!file) return;
    setLoading(true);
    setResult("");

    // convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await fetch("https://image-analyzer-three.vercel.app/api/analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: reader.result }), // send full dataURL
        });

        const data = await res.json();
        setResult(data.result);
      } catch (err) {
        console.error(err);
        setResult("Error analyzing image");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container" style={{ padding: 20 }}>
      <h2>Image AI Analyzer</h2>
      <input type="file" accept="image/*" onChange={handleFile} />
      <button onClick={analyzeImage} disabled={!file || loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      <div style={{ marginTop: 20 }}>
        {result}
      </div>
    </div>
  );
}

export default App;
