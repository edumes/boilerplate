'use client';

import { Button } from '@/components/ui/button';
import {
  DialogFooter
} from '@/components/ui/dialog';
import DraggableWrapper from '@/components/ui/draggable-wrapper';
import {
  Form
} from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { CrudFormalize } from './crud-formalize';
import { createValidationSchema } from './formValidationSchema';

interface Props {
  currentRow?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: any;
}

export function CrudActionDialog({ currentRow, open, onOpenChange, config }: Props) {
  const isEdit = !!currentRow;

  const formSchema = createValidationSchema(config.fields ?? {});

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const { control } = form;
  const watchedValues = useWatch({ control });
  console.log({ watchedValues });
  console.log({ config });

  const onSubmit = (values: any) => {
    form.reset();
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
    onOpenChange(false);
  };

  return (
    <DraggableWrapper
      title={isEdit ? `Edit ${config.config.singularName}` : `Add New ${config.config.singularName}`}
      width="min-w-96"
      height="auto"
      className={cn(
        'transition-all duration-300 ease-in-out transform',
        !open ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      )}
      defaultPosition={{
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 - 300
      }}
      maximizeButton={null}
    >
      <ScrollArea className="h-[36.25rem] pr-4 -mr-4 py-1">
        <Form {...form}>
          <form
            id='crud-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 p-0.5'
          >
            <CrudFormalize control={form.control} config={config} />
          </form>
        </Form>
      </ScrollArea>
      <DialogFooter>
        <Button type='submit' form='crud-form'>
          Save changes
        </Button>
      </DialogFooter>
    </DraggableWrapper>
  );
}
