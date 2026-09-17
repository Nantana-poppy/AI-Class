import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contacts = await prisma.contact.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.company || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: {
        userId: session.user.id,
        name: body.name,
        englishName: body.englishName || null,
        company: body.company,
        position: body.position || null,
        email: body.email,
        phone: body.phone,
        lineId: body.lineId || null,
        channel: body.channel || "โทรศัพท์",
        interestedIn: body.interestedIn || "",
        status: body.status || "รายการใหม่",
        followUpDate: body.followUpDate || new Date().toISOString().split("T")[0],
        followUpTime: body.followUpTime || null,
        timeRemaining: body.timeRemaining || null,
        notes: body.notes || "",
        noteAuthor: body.noteAuthor || session.user.name || "ฉัน",
        noteDate: body.noteDate || "วันนี้",
        avatarUrl: body.avatarUrl || null,
        avatarInitial: body.avatarInitial || body.name.charAt(0),
        avatarBg: body.avatarBg || "bg-[#e2dfff]",
        avatarColor: body.avatarColor || "text-[#4b41e1]",
        dealValue: body.dealValue || null,
      },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Failed to create contact:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
