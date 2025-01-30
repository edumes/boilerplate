import Crud from '@/features/crud'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/$crud/')({
  component: Crud,
})
