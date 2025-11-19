// app/api/links/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { generateRandomCode, isValidCode, isValidUrl } from "../../../lib/validate";

export async function GET() {
  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { url, code } = body as { url?: string; code?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL. Must start with http:// or https://" },
        { status: 400 }
      );
    }

    if (code && typeof code === "string") {
      code = code.trim();
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: "Code must be 6–8 alphanumeric characters" },
          { status: 400 }
        );
      }
    } else {
      // Auto-generate code
      let unique = false;
      let attempt = 0;
      while (!unique && attempt < 5) {
        const candidate = generateRandomCode();
        const exists = await prisma.link.findUnique({
          where: { code: candidate }
        });
        if (!exists) {
          code = candidate;
          unique = true;
        }
        attempt++;
      }
      if (!code) {
        return NextResponse.json(
          { error: "Failed to generate unique code" },
          { status: 500 }
        );
      }
    }

    // Check duplicate
    const existing = await prisma.link.findUnique({
      where: { code }
    });
    if (existing) {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }

    const link = await prisma.link.create({
      data: {
        code,
        url
      }
    });

    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
