import { createLazyFileRoute } from '@tanstack/react-router';
import Crud from '@/features/crud';

export const Route = createLazyFileRoute('/_authenticated/general/$crud/')({
  component: Crud
});
