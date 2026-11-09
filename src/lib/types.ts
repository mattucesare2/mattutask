export type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dueDate: string | null
  createdAt: string
  updatedAt: string
  category: string | null
  assignees: string | null
  userId: string
}