import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/analysis", async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ result: "No image provided" });
    }

    const [meta, base64Image] = req.body.image.split(",");
    const mimeType = meta.match(/data:(.*);base64/)?.[1] || "image/jpeg";

    const result = await model.generateContent([
      { inlineData: { mimeType, data: base64Image } },
      { text: "Describe this image in detail." }
    ]);

    const text = result.response.candidates[0].content.parts[0].text;
    res.json({ result: text });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ result: "Error analyzing image" });
  }
});

app.listen(3000, () =>
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`)
);
