import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("application/json")) {
      const json = await request.json();
      const body = JSON.stringify(json);
      const size = new TextEncoder().encode(body).byteLength;
      return NextResponse.json({ fileId: crypto.randomUUID(), size });
    }

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (file instanceof File) {
        const buffer = await file.arrayBuffer();
        return NextResponse.json({ fileId: crypto.randomUUID(), size: buffer.byteLength });
      }
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await request.arrayBuffer();
    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    return NextResponse.json({ fileId: crypto.randomUUID(), size: buffer.byteLength });
  } catch (error) {
    return NextResponse.json({ error: `Upload failed: ${error}` }, { status: 400 });
  }
}
