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

// --- Helper Functions ---

// CRC16 (CCITT-False) for VietQR
function calculateCRC16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    crc ^= c << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  crc &= 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function generateVietQR({ bankBin, accountNumber, amount, content }) {
  // 00: Payload Format Indicator
  const id00 = "000201";

  // 01: Point of Initiation Method
  const id01 = amount ? "010212" : "010211";

  // 38: Merchant Account Information (GUID + NAPAS)
  const guid = "0010A000000727";
  const binTag = `00${bankBin.length.toString().padStart(2, "0")}${bankBin}`;
  const accTag = `01${accountNumber.length
    .toString()
    .padStart(2, "0")}${accountNumber}`;
  const beneficiaryTag = `01${(binTag + accTag).length
    .toString()
    .padStart(2, "0")}${binTag + accTag}`;

  const id38Content = guid + beneficiaryTag;
  const id38 = `38${id38Content.length
    .toString()
    .padStart(2, "0")}${id38Content}`;

  // 53: Currency (VND)
  const id53 = "5303704";

  // 54: Amount (Optional)
  let id54 = "";
  if (amount) {
    id54 = `54${amount.toString().length.toString().padStart(2, "0")}${amount}`;
  }

  // 58: Country (VN)
  const id58 = "5802VN";

  // 62: Additional Data (Content)
  let id62 = "";
  if (content) {
    const contentTag = `08${content.length
      .toString()
      .padStart(2, "0")}${content}`;
    id62 = `62${contentTag.length.toString().padStart(2, "0")}${contentTag}`;
  }

  // Assemble
  const rawQR = id00 + id01 + id38 + id53 + id54 + id58 + id62 + "6304";
  const crc = calculateCRC16(rawQR);

  return rawQR + crc;
}

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

    // Check for explicit 'header' option in request body options
    const options = req.body.options ? JSON.parse(req.body.options) : {};

    // Check for 'Table' heuristics (e.g. Autofilter)
    // using bracket notation for keys that might not exist in TS types
    // Priority: Explicit Option > Autofilter Detection
    let isTableLike = false;

    if (options.header !== undefined) {
      isTableLike = Boolean(options.header);
    } else {
      isTableLike = !!(sheet["!autofilter"] || sheet["!tbl"]);
    }

    let jsonData = [];
    if (isTableLike) {
      jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } else {
      const rawData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });
      // Filter empty rows and ensure it's not just array of empty strings
      jsonData = rawData.filter(
        (row) =>
          Array.isArray(row) &&
          row.length > 0 &&
          row.some((c) => c !== "" && c != null)
      );
    }

    if (!jsonData || jsonData.length === 0) {
      return res
        .status(400)
        .json({ error: "Empty Excel file or invalid format" });
    }

    // Map Excel rows to items.
    const items = jsonData
      .map((row, index) => {
        // Logic similar to frontend 'processBatchFile'
        let text = "";

        if (isTableLike) {
          // Table Mode: Use Key: Value
          text = Object.entries(row)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n");
        } else {
          // Raw Mode: Join Values
          if (Array.isArray(row)) {
            text = row
              .map((v) => String(v || "").trim())
              .filter((v) => v)
              .join("\n");
          } else {
            text = Object.values(row)
              .map((v) => String(v).trim())
              .filter((v) => v)
              .join("\n");
          }
        }

        // Filename: Join values
        let rawFilename = "";
        if (Array.isArray(row)) {
          rawFilename = row
            .map((v) => String(v || "").trim())
            .filter((v) => v)
            .join(" - ");
        } else {
          rawFilename = Object.values(row)
            .map((v) => String(v).trim())
            .filter((v) => v)
            .join(" - ");
        }

        // Fallback filename if empty
        const filename = rawFilename || `qr_${index + 1}`;

        return { text, filename, id: index };
      })
      .filter((item) => item.text.trim().length > 0);

    if (items.length === 0) {
      return res.status(400).json({ error: "No valid data found in Excel." });
    }

    const zip = new JSZip();

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

      // Sanitize filename
      let safeFilename = item.filename.replace(/[<>:"/\\|?*]/g, "_").trim();
      // Ensure extension
      if (!safeFilename.toLowerCase().endsWith(".png")) {
        safeFilename += ".png";
      }

      zip.file(safeFilename, base64Data, { base64: true });
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

// 4. Payment QR (VietQR) Mode
app.post("/api/generate/payment", async (req, res) => {
  try {
    const { bankBin, accountNumber, amount, content, options } = req.body;

    if (!bankBin || !accountNumber) {
      return res
        .status(400)
        .json({ error: "Missing bankBin or accountNumber" });
    }

    // Generate VietQR String
    const qrString = generateVietQR({
      bankBin,
      accountNumber,
      amount,
      content,
    });

    const qrOptions = {
      color: {
        dark: options?.colorDark || "#000000",
        light: options?.colorLight || "#ffffff",
      },
      width: options?.width || 500,
      margin: options?.margin || 2,
    };

    const dataUrl = await QRCode.toDataURL(qrString, qrOptions);
    res.json({
      success: true,
      data: dataUrl,
      qrString: qrString, // Return the raw string too
      format: "data/png",
    });
  } catch (error) {
    console.error("Payment QR Error:", error);
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
