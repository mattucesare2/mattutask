import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, hashPassword } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Solo lettere, numeri e underscore'),
  password: z.string().min(6).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) {
      return NextResponse.json(
        { error: 'Username già in uso' },
        { status: 409 }
      )
    }

    const hashed = await hashPassword(password)
    const user = await prisma.user.create({
      data: { username, password: hashed },
    })

    await createSession({ id: user.id, username: user.username })

    return NextResponse.json({
      user: { id: user.id, username: user.username },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Dati non validi' }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
