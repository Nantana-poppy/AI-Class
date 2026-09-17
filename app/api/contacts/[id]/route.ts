import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await request.json();

    const existing = await prisma.contact.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Contact not found or unauthorized" },
        { status: 404 }
      );
    }

    const updated = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        name: body.name ?? existing.name,
        englishName: body.englishName ?? existing.englishName,
        company: body.company ?? existing.company,
        position: body.position ?? existing.position,
        email: body.email ?? existing.email,
        phone: body.phone ?? existing.phone,
        lineId: body.lineId ?? existing.lineId,
        channel: body.channel ?? existing.channel,
        interestedIn: body.interestedIn ?? existing.interestedIn,
        status: body.status ?? existing.status,
        followUpDate: body.followUpDate ?? existing.followUpDate,
        followUpTime: body.followUpTime ?? existing.followUpTime,
        timeRemaining: body.timeRemaining ?? existing.timeRemaining,
        notes: body.notes ?? existing.notes,
        dealValue: body.dealValue ?? existing.dealValue,
      },
    });

    return NextResponse.json({ contact: updated });
  } catch (error) {
    console.error("Failed to update contact:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await props.params;

    const existing = await prisma.contact.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Contact not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

