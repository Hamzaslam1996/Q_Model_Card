import { NextResponse } from "next/server";
import Ajv, { type ErrorObject, type JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

import schema from "@/schema/modelcard_schema.json";
import type { ModelCard } from "@/lib/types";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validate = ajv.compile<ModelCard>(schema as JSONSchemaType<ModelCard>);

function formatAjvError(error: ErrorObject) {
  const path = error.instancePath ? error.instancePath.slice(1).replace(/\//g, ".") : "modelCard";
  const message = error.message ?? "is invalid";
  return `${path || "modelCard"} ${message}`.trim();
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;
    const valid = validate(payload);

    if (valid) {
      return NextResponse.json({ valid: true });
    }

    const errors = (validate.errors ?? []).map(formatAjvError);
    return NextResponse.json({ valid: false, errors }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { valid: false, errors: ["Invalid JSON payload", message] },
      { status: 400 }
    );
  }
}
