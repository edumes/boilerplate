import useDialogState from '@/hooks/use-dialog-state';
import React, { useState } from 'react';
import { User } from '../data/schema';

type CrudDialogType = 'add' | 'edit' | 'delete';

interface CrudContextType {
  open: CrudDialogType | null;
  setOpen: (str: CrudDialogType | null) => void;
  currentRow: User | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>;
}

const CrudContext = React.createContext<CrudContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export default function CrudProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CrudDialogType>(null);
  const [currentRow, setCurrentRow] = useState<User | null>(null);

  return (
    <CrudContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CrudContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCrud = () => {
  const crudContext = React.useContext(CrudContext);

  if (!crudContext) {
    throw new Error('useCrud has to be used within <CrudContext>');
  }

  return crudContext;
};
