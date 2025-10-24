# Q_Model_Card
A digital passport for every quantum technology

## Overview

Q_Model_Card provides a standardized way to document and validate quantum technology models through a TypeScript Express API with JSON schema validation.

## Features

- **RESTful API**: TypeScript Express API for model card management
- **File Upload**: Secure file upload with UUID-based storage
- **Schema Validation**: JSON schema validation using Ajv
- **Rate Limiting**: Protection against DoS attacks
- **Path Injection Prevention**: Secure file access with sanitization
- **Docker Support**: Containerized deployment

## Quick Start

### Development

```bash
cd api
npm install
npm run dev
```

The API will be available at `http://localhost:3000`

### Production

```bash
cd api
npm install
npm run build
npm start
```

### Docker

```bash
docker build -f api/Dockerfile -t q-model-card-api .
docker run -p 3000:3000 q-model-card-api
```

## API Endpoints

- **POST /upload** - Upload files (multipart/form-data)
- **POST /modelcards/validate** - Validate model card JSON against schema
- **GET /modelcards/:id** - Retrieve model card by ID
- **GET /health** - Health check endpoint

See [api/README.md](api/README.md) for detailed API documentation.

## Project Structure

```
.
├── api/                    # TypeScript Express API
│   ├── src/               # Source code
│   ├── dist/              # Compiled JavaScript (generated)
│   ├── Dockerfile         # Docker configuration
│   └── package.json       # Node.js dependencies
├── schema/                # JSON schemas
│   └── modelcard_schema.json
├── data/                  # Model card storage
├── uploads/               # File uploads storage
└── README.md             # This file
```

## Security

The API includes several security features:

- Rate limiting (100 requests per 15 minutes per IP)
- Path injection prevention with input sanitization
- File size limits (10MB)
- CORS configuration
- Secure file storage with UUID naming

## License

ISC

