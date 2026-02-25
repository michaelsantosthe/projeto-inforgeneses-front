"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Circle,
  Clock,
  CheckCircle2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import type { Task, TaskStatus, TaskPriority } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  pending: {
    label: "Pendente",
    icon: <Circle className="size-3" />,
    className: "bg-muted text-muted-foreground border-transparent",
  },
  in_progress: {
    label: "Em Progresso",
    icon: <Clock className="size-3" />,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Concluida",
    icon: <CheckCircle2 className="size-3" />,
    className: "bg-success/10 text-success border-success/20",
  },
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; icon: React.ReactNode; className: string }
> = {
  high: {
    label: "Alta",
    icon: <ArrowUp className="size-3" />,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  medium: {
    label: "Media",
    icon: <ArrowRight className="size-3" />,
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  low: {
    label: "Baixa",
    icon: <ArrowDown className="size-3" />,
    className: "bg-muted text-muted-foreground border-transparent",
  },
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusConfig = STATUS_CONFIG[task.status]
  const priorityConfig = PRIORITY_CONFIG[task.priority]

  return (
    <div className="group relative flex items-start gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-medium leading-tight ${
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-card-foreground"
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Acoes</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
