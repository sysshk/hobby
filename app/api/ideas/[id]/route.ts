import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/auth-config"
import { prisma } from "@/lib/prisma"

// PUT - 아이디어 수정
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { text } = await request.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    const idea = await prisma.idea.findUnique({ where: { id } })
    if (!idea) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (idea.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await prisma.idea.update({
      where: { id },
      data: { text: text.trim() },
      include: {
        author: { select: { name: true } },
        likes: true,
      },
    })

    return NextResponse.json({
      id: updated.id,
      text: updated.text,
      author: "익명",
      likes: updated.likes.length,
      isLiked: updated.likes.some(like => like.userId === session.user?.id),
      date: updated.createdAt.toLocaleDateString("ko-KR"),
    })
  } catch (error) {
    console.error("Idea update error:", error)
    return NextResponse.json({ error: "Failed to update idea" }, { status: 500 })
  }
}

// DELETE - 아이디어 삭제
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const idea = await prisma.idea.findUnique({ where: { id } })
    if (!idea) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (idea.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.idea.delete({ where: { id } })

    return NextResponse.json({ deleted: true })
  } catch (error) {
    console.error("Idea delete error:", error)
    return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 })
  }
}
