import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Ajv for JSON schema validation
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load schema
const schemaPath = path.join(__dirname, '../../schema/modelcard_schema.json');
const modelCardSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
const validateModelCard = ajv.compile(modelCardSchema);

// Configure multer for file uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${fileId}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Routes

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /upload - Upload file endpoint
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileId = path.parse(req.file.filename).name;
    
    res.status(200).json({
      fileId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: req.file.path
    });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed', message: String(error) });
  }
});

// POST /modelcards/validate - Validate model card JSON
app.post('/modelcards/validate', (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ 
        valid: false, 
        errors: [{ message: 'Request body is empty or invalid' }] 
      });
    }

    const valid = validateModelCard(data);
    
    if (valid) {
      res.status(200).json({ valid: true, errors: [] });
    } else {
      res.status(200).json({ 
        valid: false, 
        errors: validateModelCard.errors || [] 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      valid: false, 
      errors: [{ message: 'Validation failed', detail: String(error) }] 
    });
  }
});

// GET /modelcards/:id - Retrieve model card by ID
app.get('/modelcards/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Try to find the file with .json extension
    const filePath = path.join(dataDir, `${id}.json`);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Model card not found' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const modelCard = JSON.parse(fileContent);
    
    res.status(200).json(modelCard);
  } catch (error) {
    if (error instanceof SyntaxError) {
      res.status(500).json({ error: 'Invalid JSON in model card file' });
    } else {
      res.status(500).json({ error: 'Failed to retrieve model card', message: String(error) });
    }
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

export default app;
