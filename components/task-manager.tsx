"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, ClipboardList, LogOut } from "lucide-react"
import { toast } from "sonner"

import { TaskCard } from "@/components/task-card"
import { TaskFormDialog } from "@/components/task-form-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { TaskPagination } from "@/components/task-pagination"
import { TaskFilters } from "@/components/task-filters"
import { StatsCards } from "@/components/stats-cards"
import { useRouter } from "next/navigation"

import { fetchAllTasks, createTask, updateTask, deleteTask, logout } from "@/lib/api"

import type {
  Task,
  TaskStatus,
  TaskPriority,
  PaginatedResponse,
  CreateTaskPayload,
} from "@/lib/types"

export function TaskManager() {
  const [data, setData] = useState<PaginatedResponse<Task> | null>(null)
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all"
  )
  const [sortBy, setSortBy] = useState<"created_at" | "priority">("created_at")

  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null)

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    try {
      const [result, allResult] = await Promise.all([
        fetchAllTasks(page, 10, {
          status: statusFilter === "all" ? undefined : statusFilter,
          priority: priorityFilter === "all" ? undefined : priorityFilter,
          search: search || undefined,
          sortBy,
          sortOrder: "desc",
        }),
        fetchAllTasks(1, 1000),
      ])
      setData(result)
      setAllTasks(allResult.data)
    } catch {
      toast.error("Erro ao carregar tarefas.")
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, priorityFilter, sortBy])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      /* debounce triggers re-render via search state */
    }, 300)
  }

  const handleCreate = async (payload: CreateTaskPayload) => {
    await createTask(payload)
    toast.success("Tarefa criada com sucesso!")
    setPage(1)
    await loadTasks()
  }

  const handleEdit = async (payload: CreateTaskPayload) => {
    if (!editTask) return
    await updateTask(editTask.id, payload)
    toast.success("Tarefa atualizada com sucesso!")
    await loadTasks()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteTask(deleteTarget.id)
      toast.success("Tarefa excluida com sucesso!")
      setDeleteTarget(null)
      await loadTasks()
    } catch {
      toast.error("Erro ao excluir tarefa.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Gerenciador de Tarefas
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize e acompanhe suas tarefas de desenvolvimento.
          </p>
        </div>
        <div className="mt-3 flex items-center gap-2 sm:mt-0">
        <Button onClick={() => setCreateOpen(true)} className="mt-3 sm:mt-0">
          <Plus className="size-4" />
          Nova Tarefa
        </Button>
            <Button
        variant="outline"
        size="icon"
        onClick={async () => {
          try {
            await logout()
            toast.success("Logout realizado com sucesso!")
            window.location.href = "/"
          } catch (err) {
            console.error("Falha no logout:", err)
            toast.error("Erro ao sair. Tente novamente.")
            window.location.href = "/"
          }
        }}
        aria-label="Sair"
        title="Sair"
        className="text-muted-foreground hover:text-destructive hover:border-destructive"
      >
        <LogOut className="size-4" />
      </Button>
      </div>
      </div>

      <StatsCards tasks={allTasks} total={allTasks.length} />

      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 md:p-6">
        <TaskFilters
          search={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={(v) => {
            setStatusFilter(v)
            setPage(1)
          }}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={(v) => {
            setPriorityFilter(v)
            setPage(1)
          }}
          sortBy={sortBy}
          onSortByChange={setSortBy}
        />

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2 mt-1">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="flex flex-col gap-3">
            {data.data.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={(t) => setEditTask(t)}
                onDelete={(t) => setDeleteTarget(t)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="rounded-full bg-muted p-4">
              <ClipboardList className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Nenhuma tarefa encontrada.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" />
              Criar primeira tarefa
            </Button>
          </div>
        )}

        {data && data.last_page > 1 && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Mostrando {(data.current_page - 1) * data.per_page + 1}-
              {Math.min(data.current_page * data.per_page, data.total)} de{" "}
              {data.total} tarefas
            </p>
            <TaskPagination
              currentPage={data.current_page}
              lastPage={data.last_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {createOpen && (
        <TaskFormDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
        />
      )}

      {editTask && (
        <TaskFormDialog
          key={editTask.id}
          open={!!editTask}
          onOpenChange={(open) => {
            if (!open) setEditTask(null)
          }}
          task={editTask}
          onSubmit={handleEdit}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            if (!open) setDeleteTarget(null)
          }}
          taskTitle={deleteTarget.title}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
