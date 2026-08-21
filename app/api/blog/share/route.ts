// app/api/blog/share/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_PLATFORMS = ["whatsapp", "facebook", "x", "linkedin", "instagram"];

export async function POST(req: NextRequest) {
    try {
        const { postId, platform } = await req.json();

        if (!postId || !VALID_PLATFORMS.includes(platform)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        await prisma.shareEvent.create({
            data: { postId, platform },
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Share tracking error:", error);
        // Never break the share action for the user over a tracking failure
        return NextResponse.json({ ok: false }, { status: 200 });
    }
}