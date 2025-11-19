import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma"; // from app/[code] -> up two levels to lib/prisma

export async function GET(_req: NextRequest, { params }: { params: { code?: string } }) {
  try {
    const code = params?.code;
    if (!code) {
      return NextResponse.json({ error: "Missing code param" }, { status: 400 });
    }

    const reserved = ["api", "healthz", "code", "_next", "favicon.ico"];
    if (reserved.includes(code)) return NextResponse.next();

    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.link.update({
      where: { code },
      data: { clicks: { increment: 1 }, lastClicked: new Date() }
    });

    return NextResponse.redirect(link.url, 302);
  } catch (err: any) {
    console.error("Redirect handler error:", err);
    return NextResponse.json(
      { error: "internal_server_error", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
