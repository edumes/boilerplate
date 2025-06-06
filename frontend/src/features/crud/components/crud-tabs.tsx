import { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import { TabConfig } from '@/types/forms';
import { House, SaveIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCrud } from '../context/crud-context';
import { CrudFormalize } from './crud-formalize';
import { createValidationSchema } from './formValidationSchema';

export function CrudTabs() {
  const { crudConfig, crudEditData, isLoadingEditData } = useCrud();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { crud, id: uuid } = useParams();
  const isEdit = !!uuid;

  const validationSchema = createValidationSchema(crudConfig.fields);
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: crudEditData || {}
  });

  // useEffect(() => {
  //   if (isEdit && crudEditData && !isLoadingEditData) {
  //     Object.entries(crudEditData).forEach(([key, value]) => {
  //       methods.setValue(key, value);
  //     });
  //   }
  // }, [crudEditData, isEdit, isLoadingEditData, methods]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (isEdit) {
        const response = await api.put(`/${crud}/${uuid}`, data);
        return response.data;
      } else {
        const response = await api.post(`/${crud}`, data);
        return response.data;
      }
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: `${isEdit ? 'Updated' : 'Created'} successfully!`
      });
      navigate(`/general/${crud}`);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title:
          error.response?.data?.message ||
          `An error occurred while ${isEdit ? 'updating' : 'creating'}`
      });
    }
  });

  const watchedValues = useWatch({ control: methods.control });
  console.log({
    watchedValues,
    errors: methods.formState.errors,
    isValid: methods.formState.isValid
  });

  // Group fields by tab
  const fieldsByTab = Object.entries(crudConfig.fields).reduce(
    (acc, [fieldName, field]: any) => {
      const tabKey = field.tabs?.[0] || 'main';
      if (!acc[tabKey]) {
        acc[tabKey] = {};
      }
      acc[tabKey][fieldName] = field;
      return acc;
    },
    {} as Record<string, any>
  );

  const handleFormSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)} className='flex flex-col gap-4'>
        <Tabs defaultValue={crudConfig.config.tabs[0]?.key || 'main'}>
          <ScrollArea>
            <TabsList className='mb-3 h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground'>
              {crudConfig.config.tabs.map((tab: TabConfig) => (
                <TabsTrigger
                  key={tab.key}
                  value={tab.key}
                  className='relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent'
                >
                  {tab.key === 'main' && (
                    <House
                      className='-ms-0.5 me-1.5 opacity-60'
                      size={16}
                      strokeWidth={2}
                      aria-hidden='true'
                    />
                  )}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {crudConfig.config.tabs.map((tab: TabConfig) => (
            <TabsContent key={tab.key} value={tab.key}>
              <CrudFormalize
                {...methods}
                config={{ fields: fieldsByTab[tab.key] || {} }}
                setValue={methods.setValue}
              />
            </TabsContent>
          ))}
        </Tabs>

        <div className='flex justify-end mt-4 mb-3'>
          <Button
            type='submit'
            loading={submitting}
            effect='expandIcon'
            icon={SaveIcon}
            iconPlacement='right'
          >
            {submitting ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
