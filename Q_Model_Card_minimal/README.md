# Q-Card Generator

A minimal viable product for creating, validating, and presenting Quantum Model Cards (sections A–J) inspired by Mark Everitt (2024). The app is built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui primitives.

## Features

- Guided input experience for entity metadata, supporting file uploads, and narrative content for each section of the model card.
- JSON Schema validation via AJV + ajv-formats against the bundled Everitt 2024 schema.
- Styled presentation layer that renders every section in shadcn-styled cards with download and export actions.
- Lightweight upload endpoint that accepts JSON or PDF payloads and returns transient IDs.

## Getting started

```bash
npm install
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

## Schema

The schema located at [`schema/modelcard_schema.json`](schema/modelcard_schema.json) reflects the MVP data contract across metadata and sections A–J.

## Reproduce locally from scratch

```bash
npx create-next-app@latest q-card --ts
cd q-card
npm i ajv ajv-formats multer tailwindcss postcss autoprefixer @radix-ui/react-icons
npx tailwindcss init -p
npm run dev
```
