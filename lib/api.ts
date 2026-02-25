"use client"

import Cookies from "js-cookie"
import type {
  Task,
  TaskStatus,
  TaskPriority,
  PaginatedResponse,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

function getAuthToken() {
  return Cookies.get("authToken")
}

const getHeaders = () => {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function fetchAllTasks(
  page = 1,
  perPage = 10,
  filters?: {
    status?: TaskStatus
    priority?: TaskPriority
    search?: string
    sortBy?: "created_at" | "priority"
    sortOrder?: "asc" | "desc"
  }
): Promise<PaginatedResponse<Task>> {
  const token = getAuthToken()

  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
    ...(filters?.status && { status: filters.status }),
    ...(filters?.priority && { priority: filters.priority }),
    ...(filters?.search && { search: filters.search }),
    ...(filters?.sortBy && { sortBy: filters.sortBy }),
    ...(filters?.sortOrder && { sortOrder: filters.sortOrder }),
  })

  const response = await fetch(`${API_URL}/tasks?${params}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (!response.ok) {
    throw new Error("Erro ao buscar tarefas")
  }

  return response.json()
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || "Erro ao criar tarefa")
  }

  return response.json()
}

export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || "Erro ao atualizar tarefa")
  }

  return response.json()
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || "Erro ao excluir tarefa")
  }
}

export async function logout(): Promise<void> {
  const token = getAuthToken()

  try {
    const response = await fetch(`${API_URL}/logout`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    })

    if (!response.ok) {
      console.warn("Logout no servidor falhou, mas limpando localmente", response.status)
    }

  } catch (err) {
    console.error("Erro na chamada de logout:", err)
  } finally {
    Cookies.remove("authToken", { path: "/" })
  }
}