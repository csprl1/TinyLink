// app/api/links/[code]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

interface Params {
  params: { code: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { code } = params;
  const link = await prisma.link.findUnique({
    where: { code }
  });
  if (!link) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(link);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { code } = params;
  const existing = await prisma.link.findUnique({
    where: { code }
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.link.delete({ where: { code } });

  return NextResponse.json({ ok: true }, { status: 200 });
}
