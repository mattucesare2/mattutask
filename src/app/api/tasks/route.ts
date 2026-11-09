import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  dueDate: z.string().datetime().optional().nullable().or(z.literal('')),
  category: z.string().max(50).optional().nullable(),
  assignees: z.string().max(300).optional().nullable(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const completed = searchParams.get('completed')
  const category = searchParams.get('category')

  const where: any = { userId: session.id }
  if (completed === 'true') where.completed = true
  if (completed === 'false') where.completed = false
  if (category) where.category = category

  const tasks = await prisma.task.findMany({
    where,
    orderBy: [
      { completed: 'asc' },
      { dueDate: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  return NextResponse.json({ tasks })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        category: data.category || null,
	assignees: data.assignees || null,
        userId: session.id,
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
