import express from "express";
import cors from "cors";
import QRCode from "qrcode";
import JSZip from "jszip";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import * as XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// --- API Routes ---

// 1. Plaintext / Single Mode
app.post("/api/generate/plain", async (req, res) => {
  try {
    const { text, options } = req.body;
    if (!text) return res.status(400).json({ error: "Missing text field" });

    const qrOptions = {
      color: {
        dark: options?.colorDark || "#000000",
        light: options?.colorLight || "#ffffff",
      },
      width: options?.width || 500,
      margin: options?.margin || 2,
    };

    const dataUrl = await QRCode.toDataURL(text, qrOptions);
    res.json({
      success: true,
      data: dataUrl,
      format: "data/png",
    });
  } catch (error) {
    console.error("Error generating QR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Batch Mode
app.post("/api/generate/batch", async (req, res) => {
  try {
    const { items, options } = req.body;
    // Expected items: [{ id: '1', text: 'abc' }, { id: '2', text: 'def' }]

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing or empty items array" });
    }

    const zip = new JSZip();
    const qrOptions = {
      color: {
        dark: options?.colorDark || "#000000",
        light: options?.colorLight || "#ffffff",
      },
      width: options?.width || 500,
      margin: options?.margin || 1,
    };

    // Process in parallel with concurrency limit if needed, for now Promise.all
    // Note: For very large batch, we might need chunking.
    const promises = items.map(async (item) => {
      if (!item.text) return;
      const dataUrl = await QRCode.toDataURL(item.text, qrOptions);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      const fileName =
        item.filename ||
        `qr_${item.id || Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 5)}.png`;
      zip.file(fileName, base64Data, { base64: true });
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: "nodebuffer" });

    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=batch_qrcodes.zip");
    res.set("Content-Length", content.length);
    res.send(content);
  } catch (error) {
    console.error("Batch Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Excel Mode
app.post("/api/generate/excel", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read Excel buffer
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (!jsonData || jsonData.length === 0) {
      return res
        .status(400)
        .json({ error: "Empty Excel file or invalid format" });
    }

    // Map Excel rows to items.
    // Assumes columns: 'text' (required), 'filename' (optional)
    const items = jsonData
      .map((row, index) => ({
        text: row.text || row.content || row.url || Object.values(row)[0], // Fallback to first column
        filename: row.filename || `qr_${index + 1}.png`,
        id: index,
      }))
      .filter((item) => item.text);

    if (items.length === 0) {
      return res
        .status(400)
        .json({
          error: "No valid data found in Excel. Ensure a 'text' column exists.",
        });
    }

    const zip = new JSZip();
    // Default options for now, could be parsed from query params or body fields if needed
    const options = req.body.options ? JSON.parse(req.body.options) : {};

    const qrOptions = {
      color: {
        dark: options?.colorDark || "#000000",
        light: options?.colorLight || "#ffffff",
      },
      width: parseInt(options?.width) || 500,
      margin: parseInt(options?.margin) || 1,
    };

    const promises = items.map(async (item) => {
      const dataUrl = await QRCode.toDataURL(String(item.text), qrOptions);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
      // Ensure strict filename
      const safeFilename = item.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
      zip.file(
        safeFilename.endsWith(".png") ? safeFilename : `${safeFilename}.png`,
        base64Data,
        { base64: true }
      );
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: "nodebuffer" });

    res.set("Content-Type", "application/zip");
    res.set("Content-Disposition", "attachment; filename=excel_qrcodes.zip");
    res.set("Content-Length", content.length);
    res.send(content);
  } catch (error) {
    console.error("Excel Generation Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- Static Serving (SPA) ---
// Serve static files from the React dist directory
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Handle SPA routing: return index.html for all non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
