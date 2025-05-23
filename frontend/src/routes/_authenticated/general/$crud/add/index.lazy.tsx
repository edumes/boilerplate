import { createLazyFileRoute } from '@tanstack/react-router';
import CrudEditAddPage from '@/features/crud/crud-edit-add-page';

export const Route = createLazyFileRoute('/_authenticated/general/$crud/add/')({
  component: CrudEditAddPage
});
