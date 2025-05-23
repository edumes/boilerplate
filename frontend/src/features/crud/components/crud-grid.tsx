import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CrudFormalize } from './crud-formalize';
import { CrudTable } from './crud-table';
import { DataTableColumnHeader } from './data-table-column-header';

interface CrudGridProps {
  crud: string;
  data: any[];
  onChange?: (newData: any[]) => void;
}

export function CrudGrid({ crud, data, onChange }: CrudGridProps) {
  const [open, setOpen] = useState(false);
  const form = useForm();

  const { data: config } = useQuery({
    queryKey: [`${crud}-fields`],
    queryFn: async () => {
      const response = await api.get(`/${crud}/fields`);
      return response.data.data || {};
    }
  });

  const gridFields = Object.entries(config?.fields || {})
    .filter(([_, field]: [string, any]) => field.canBrowse === true)
    .map(([key, field]: [string, any]) => ({
      accessorKey: key,
      header: ({ column }: any) => <DataTableColumnHeader column={column} title={field.label} />,
      cell: ({ row }: any) => {
        const value = row.getValue(key);
        return <div>{value}</div>;
      }
    }));

  const handleAdd = () => {
    setOpen(true);
  };

  const handleSave = (formData: any) => {
    const newData = [...data, formData];
    onChange?.(newData);
    setOpen(false);
    form.reset();
  };

  return (
    <Card>
      <div className='flex justify-end'>
        <Button onClick={handleAdd} size='sm' className='gap-2'>
          <PlusIcon size={16} />
          Adicionar
        </Button>
      </div>
      <CrudTable data={data} crud={crud} fields={gridFields} pagination={false} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item</DialogTitle>
          </DialogHeader>
          <div className='py-4'>
            <CrudFormalize control={form.control} config={config} setValue={form.setValue} />
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={form.handleSubmit(handleSave)}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
