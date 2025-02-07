import useDialogState from '@/hooks/use-dialog-state';
import React, { useState } from 'react';
import { User } from '../data/schema';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type CrudDialogType = 'add' | 'edit' | 'delete';

interface CrudContextType {
  open: CrudDialogType | null;
  setOpen: (str: CrudDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
  crudConfig: any;
  crudEditData: any;
  isLoadingConfig: boolean;
  isLoadingEditData: boolean;
}

const CrudContext = React.createContext<CrudContextType | null>(null);

export interface CrudProviderProps {
  children: React.ReactNode;
  crud: string;
  id?: string;
}

export default function CrudProvider({ children, crud, id }: CrudProviderProps) {
  const {
    data: crudConfig,
    isLoading: isLoadingConfig,
  } = useQuery({
    queryKey: [`${crud}-fields`],
    queryFn: async () => {
      const response = await api.get(`/${crud}/fields`);
      return response.data.data || {};
    },
    staleTime: 150000,
  });

  const {
    data: crudEditData,
    isLoading: isLoadingEditData,
  } = useQuery({
    queryKey: [`${crud}-${id}`],
    queryFn: async () => {
      const response = await api.get(`/${crud}/${id}`);
      return response.data.data || [];
    },
  });

  const [open, setOpen] = useDialogState<CrudDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);

  return (
    <CrudContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        crudConfig,
        crudEditData,
        isLoadingConfig,
        isLoadingEditData,
      }}
    >
      {children}
    </CrudContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCrud = () => {
  const crudContext = React.useContext(CrudContext);

  if (!crudContext) {
    throw new Error('useCrud has to be used within <CrudProvider>');
  }

  return crudContext;
};
