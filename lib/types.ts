export type TaskStatus = "pending" | "in_progress" | "completed"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface CreateTaskPayload {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}
