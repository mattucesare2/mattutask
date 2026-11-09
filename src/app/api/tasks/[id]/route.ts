import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
  completed: z.boolean().optional(),
  dueDate: z.string().datetime().optional().nullable().or(z.literal('')),
  category: z.string().max(50).optional().nullable(),
  assignees: z.string().max(300).optional().nullable(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const { id } = await params

  try {
    const existing = await prisma.task.findFirst({
      where: { id, userId: session.id },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Attività non trovata' }, { status: 404 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.category !== undefined && { category: data.category }),
	...(data.assignees !== undefined && { assignees: data.assignees }),
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const { id } = await params

  const existing = await prisma.task.findFirst({
    where: { id, userId: session.id },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Attività non trovata' }, { status: 404 })
  }

  await prisma.task.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
