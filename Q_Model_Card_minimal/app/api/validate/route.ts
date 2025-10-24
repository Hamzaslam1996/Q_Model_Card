import { NextResponse } from "next/server";
import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";

import schema from "../../../schema/modelcard_schema.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const valid = validate(payload);
    if (valid) {
      return NextResponse.json({ valid: true });
    }
    const errors = (validate.errors ?? []) as ErrorObject[];
    return NextResponse.json({ valid: false, errors }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { valid: false, errors: ["Invalid JSON payload", `${error}`] },
      { status: 400 }
    );
  }
}
