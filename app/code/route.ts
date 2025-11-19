// app/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

interface Params {
  params: { code: string };
}

// Visiting /{code} should 302 redirect or 404
export async function GET(_req: NextRequest, { params }: Params) {
  const { code } = params;

  // Ignore paths that are reserved in case of weird matches
  const reserved = ["api", "healthz", "code", "_next", "favicon.ico"];
  if (reserved.includes(code)) {
    return NextResponse.next();
  }

  const link = await prisma.link.findUnique({
    where: { code }
  });

  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date()
    }
  });

  return NextResponse.redirect(link.url, { status: 302 });
}
