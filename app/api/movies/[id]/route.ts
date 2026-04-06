import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "Missing movie id" }, { status: 400 });
    }

    await prisma.movie.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE ROUTE ERROR:", error);
    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}