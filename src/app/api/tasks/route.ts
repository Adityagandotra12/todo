import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple placeholder user (no auth implemented)
const DEFAULT_USER_ID = 1;

// GET /api/tasks - fetch all tasks (with optional query, filter, priority)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const filter = searchParams.get("filter") ?? "all";

    const where: any = {
      userId: DEFAULT_USER_ID,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (filter === "completed") where.completed = true;
    if (filter === "pending") where.completed = false;
    if (filter === "high") where.priority = "HIGH";

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

// POST /api/tasks - create a new task
// Expects: { title, description?, priority?, dueDate? }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      priority = "MEDIUM",
      dueDate,
    } = body as {
      title?: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      dueDate?: string;
    };

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 },
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: DEFAULT_USER_ID,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error", error);
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { error: "Failed to create task", message },
      { status: 500 },
    );
  }
}

// PUT /api/tasks - update a task
// Expects: { id, title?, description?, priority?, completed?, dueDate? }
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      priority,
      completed,
      dueDate,
    } = body as {
      id?: number;
      title?: string;
      description?: string;
      priority?: "LOW" | "MEDIUM" | "HIGH";
      completed?: boolean;
      dueDate?: string | null;
    };

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Valid task id is required" },
        { status: 400 },
      );
    }

    const data: any = {};
    if (typeof title === "string") data.title = title;
    if (typeof description === "string") data.description = description;
    if (priority) data.priority = priority;
    if (typeof completed === "boolean") data.completed = completed;
    if (dueDate !== undefined) {
      data.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const task = await prisma.task.update({
      where: { id, userId: DEFAULT_USER_ID },
      data,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("PUT /api/tasks error", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}

// DELETE /api/tasks - delete a task
// Expects JSON body: { id: number }
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body as { id?: number };

    if (!id || typeof id !== "number") {
      return NextResponse.json(
        { error: "Valid task id is required" },
        { status: 400 },
      );
    }

    await prisma.task.delete({
      where: { id, userId: DEFAULT_USER_ID },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/tasks error", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}

