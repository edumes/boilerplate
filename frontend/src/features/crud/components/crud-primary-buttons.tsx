import { Button } from '@/components/ui/button';
import { IconUserPlus } from '@tabler/icons-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useCrud } from '../context/crud-context';

export function CrudPrimaryButtons() {
  const { setOpen } = useCrud();
  const params = useParams({ strict: false });
  const { crud } = params;
  const navigate = useNavigate();

  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => navigate({ to: `/general/${crud}/add` })}>
        <span>Add User</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
