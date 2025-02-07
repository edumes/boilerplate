import CrudEditAddPage from '@/features/crud/crud-edit-add-page'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/general/$crud/$id/')({
  component: CrudEditAddPage,
})
