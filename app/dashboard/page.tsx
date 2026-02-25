import { TaskManager } from "@/components/task-manager"
import { Toaster } from "sonner"

export default function DashboardPage() {
  return (
    <>
      <main className="mx-auto min-h-screen max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <TaskManager />
      </main>
      <Toaster position="bottom-right" richColors closeButton theme="dark" />
    </>
  )
}
