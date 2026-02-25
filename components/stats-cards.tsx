"use client"

import {
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
} from "lucide-react"
import type { Task } from "@/lib/types"

interface StatsCardsProps {
  tasks: Task[]
  total: number
}

export function StatsCards({ tasks, total }: StatsCardsProps) {
  const completed = tasks.filter((t) => t.status === "completed").length
  const inProgress = tasks.filter((t) => t.status === "in_progress").length
  const pending = tasks.filter((t) => t.status === "pending").length
  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "completed").length

  const stats = [
    {
      label: "Total",
      value: total,
      icon: <ListTodo className="size-4" />,
      className: "bg-primary/10 text-primary",
    },
    {
      label: "Concluidas",
      value: completed,
      icon: <CheckCircle2 className="size-4" />,
      className: "bg-success/10 text-success",
    },
    {
      label: "Em Progresso",
      value: inProgress,
      icon: <Clock className="size-4" />,
      className: "bg-primary/10 text-primary",
    },
    {
      label: "Alta Prioridade",
      value: highPriority,
      icon: <TrendingUp className="size-4" />,
      className: "bg-destructive/10 text-destructive",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border bg-card p-4 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`rounded-md p-1.5 ${stat.className}`}>
              {stat.icon}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {stat.label}
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-card-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
