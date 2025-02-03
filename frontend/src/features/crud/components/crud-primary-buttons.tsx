import { Button } from '@/components/ui/button';
import { IconUserPlus } from '@tabler/icons-react';
import { useCrud } from '../context/crud-context';

export function CrudPrimaryButtons() {
  const { setOpen } = useCrud();
  return (
    <div className='flex gap-2'>
      <Button className='space-x-1' onClick={() => setOpen('add')}>
        <span>Add User</span> <IconUserPlus size={18} />
      </Button>
    </div>
  );
}
