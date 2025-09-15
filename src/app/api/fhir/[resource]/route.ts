import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource } = await context.params;

    const url = new URL(req.url);
    const query = url.searchParams.toString();
    const target = `${process.env.NEXT_PUBLIC_FHIR_BASE}/${resource}${query ? `?${query}` : ""}`;

    const res = await fetch(target);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FHIR resource" }, { status: 500 });
  }
}

export async function POST(req: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource } = await context.params;

    const body = await req.json();
    const target = `${process.env.NEXT_PUBLIC_FHIR_BASE}/${resource}`;

    const res = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/fhir+json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FHIR Dashboard" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource } = await context.params;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing resource ID" }, { status: 400 });

    const body = await req.json();
    const target = `${process.env.NEXT_PUBLIC_FHIR_BASE}/${resource}/${id}`;

    const res = await fetch(target, {
      method: "PUT",
      headers: {
        "Content-Type": "application/fhir+json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FHIR resource" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource } = await context.params;

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing resource ID" }, { status: 400 });

    const target = `${process.env.NEXT_PUBLIC_FHIR_BASE}/${resource}/${id}`;
    const res = await fetch(target, { method: "DELETE" });

    return NextResponse.json({ status: res.status });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete FHIR resource" }, { status: 500 });
  }
}
