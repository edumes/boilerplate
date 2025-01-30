'use client';

import { PasswordInput } from '@/components/password-input';
import { SelectDropdown } from '@/components/select-dropdown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userTypes } from '../data/data';
import { User } from '../data/schema';
import { ChevronDown } from 'lucide-react';
import DraggableWrapper from '@/components/ui/draggable-wrapper';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { createValidationSchema } from './formValidationSchema';

interface Props {
  currentRow?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: any;
}

export function CrudActionDialog({ currentRow, open, onOpenChange, fields }: Props) {
  const isEdit = !!currentRow;

  const formSchema = createValidationSchema(fields);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

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

  console.log({ fields })

  return (
    <DraggableWrapper
      title={isEdit ? 'Edit User' : 'Add New User'}
      width="min-w-96"
      height="auto"
      className={cn(
        'transition-all duration-300 ease-in-out transform',
        !open ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      )}
      defaultPosition={{
        x: window.innerWidth / 2 - 192,
        y: window.innerHeight / 2 - 200
      }}
    >
      <ScrollArea className="h-[26.25rem] w-full pr-4 -mr-4 py-1">
        <Form {...form}>
          <form
            id="crud-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-0.5"
          >
            <div>
              {Object.entries(fields).map(([fieldName, field]: any) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field: formField }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.type === 'text' && (
                          <Input placeholder={field.label} {...formField} />
                        )}
                        {/* {field.type === 'password' && (
                          <PasswordInput placeholder={field.label} {...formField} />
                        )}
                        {field.type === 'select' && (
                          <Select
                            // items={field.options} // Passando opções para o dropdown
                            {...formField}
                          />
                        )} */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
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
