# Q_Model_Card API

TypeScript Express API for managing quantum model cards with file upload and JSON schema validation.

## Features

- **File Upload**: Upload files with automatic UUID generation
- **JSON Schema Validation**: Validate model card data against schema
- **Model Card Retrieval**: Fetch model cards by ID from the data directory
- **CORS Support**: Cross-origin resource sharing enabled
- **Type Safety**: Built with TypeScript for enhanced type safety

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

```bash
cd api
npm install
```

## Development

Run the API in development mode with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

Built files will be in the `dist/` directory.

## Production

Start the production server:

```bash
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

Returns the API status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-24T09:27:04.635Z"
}
```

### Upload File

```
POST /upload
```

Upload a file using multipart/form-data. Files are stored in the `/uploads` directory with a UUID filename.

**Request:**
- Content-Type: `multipart/form-data`
- Body: File field named `file`

**Response:**
```json
{
  "fileId": "1b98be2c-fef9-4d57-add5-79ed28d674e8",
  "filename": "1b98be2c-fef9-4d57-add5-79ed28d674e8.txt",
  "originalName": "test-file.txt",
  "size": 36,
  "mimetype": "text/plain",
  "path": "/path/to/uploads/1b98be2c-fef9-4d57-add5-79ed28d674e8.txt"
}
```

### Validate Model Card

```
POST /modelcards/validate
```

Validate a model card JSON object against the schema defined in `/schema/modelcard_schema.json`.

**Request:**
```json
{
  "name": "Quantum Fourier Transform",
  "version": "1.0.0",
  "type": "algorithm"
}
```

**Response (Valid):**
```json
{
  "valid": true,
  "errors": []
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "errors": [
    {
      "instancePath": "",
      "schemaPath": "#/required",
      "keyword": "required",
      "params": {
        "missingProperty": "version"
      },
      "message": "must have required property 'version'"
    }
  ]
}
```

### Get Model Card

```
GET /modelcards/:id
```

Retrieve a model card by ID from the `/data` directory.

**Parameters:**
- `id`: The model card ID (filename without .json extension)

**Response:**
```json
{
  "name": "Quantum Fourier Transform",
  "version": "1.0.0",
  "type": "algorithm",
  "description": "Implementation of the Quantum Fourier Transform algorithm",
  "author": {
    "name": "Test Author",
    "email": "author@example.com",
    "organization": "Quantum Research Lab"
  },
  "metadata": {
    "qubits": 5,
    "gates": ["H", "CNOT", "RZ", "T"],
    "accuracy": 0.95,
    "errorRate": 0.01
  },
  "tags": ["fourier", "transform", "quantum", "algorithm"],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T00:00:00Z"
}
```

## Model Card Schema

Model cards must conform to the JSON schema defined in `/schema/modelcard_schema.json`.

### Required Fields

- `name` (string): Name of the quantum model
- `version` (string): Version of the model
- `type` (string): Type of quantum model (algorithm, circuit, hardware, simulator, other)

### Optional Fields

- `description` (string): Detailed description
- `author` (object): Author information (name, email, organization)
- `metadata` (object): Technical metadata (qubits, gates, accuracy, errorRate)
- `tags` (array): Array of string tags
- `createdAt` (string): ISO 8601 date-time
- `updatedAt` (string): ISO 8601 date-time

## Docker

Build the Docker image from the repository root:

```bash
cd /path/to/Q_Model_Card
docker build -f api/Dockerfile -t q-model-card-api .
```

Run the container:

```bash
docker run -p 3000:3000 \
  -v $(pwd)/uploads:/uploads \
  -v $(pwd)/data:/data \
  q-model-card-api
```

The API will be available at `http://localhost:3000`

## Project Structure

```
api/
├── src/
│   └── index.ts          # Main Express application
├── dist/                 # Compiled JavaScript (generated)
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration

schema/
└── modelcard_schema.json # JSON schema for validation

uploads/                 # Uploaded files (gitignored)
data/                   # Model card JSON files
```

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Error Handling

The API includes comprehensive error handling:

- 400: Bad request (missing file, invalid JSON)
- 404: Resource not found
- 500: Internal server error

All errors return a JSON response with an `error` field describing the issue.

## Technologies

- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **Multer**: File upload handling
- **Ajv**: JSON schema validation
- **UUID**: Unique file ID generation
- **CORS**: Cross-origin support

## License

ISC
