import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createSession, verifyPassword } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = schema.parse(body)

    const user = await prisma.user.findUnique({ where: { username } })
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: 'Username o password non validi' },
        { status: 401 }
      )
    }

    await createSession({ id: user.id, username: user.username })

    return NextResponse.json({
      user: { id: user.id, username: user.username },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 })
  }
}
