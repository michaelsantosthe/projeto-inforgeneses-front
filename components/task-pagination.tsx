"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface TaskPaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function TaskPagination({
  currentPage,
  lastPage,
  onPageChange,
}: TaskPaginationProps) {
  if (lastPage <= 1) return null

  const pages: (number | "ellipsis")[] = []

  if (lastPage <= 5) {
    for (let i = 1; i <= lastPage; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push("ellipsis")
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(lastPage - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < lastPage - 2) pages.push("ellipsis")
    pages.push(lastPage)
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Anterior</span>
      </Button>

      {pages.map((page, i) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="flex size-8 items-center justify-center text-xs text-muted-foreground"
          >
            {"..."}
          </span>
        ) : (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            className="size-8 text-xs"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-8"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Proximo</span>
      </Button>
    </div>
  )
}
