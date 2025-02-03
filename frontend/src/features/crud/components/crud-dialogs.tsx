import { useCrud } from '../context/crud-context';
import { CrudActionDialog } from './crud-action-dialog';
import { CrudDeleteDialog } from './crud-delete-dialog';

export function CrudDialogs(config: any) {
  const { open, setOpen, currentRow, setCurrentRow } = useCrud();
  return (
    <>
      <CrudActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
        {...config}
      />

      {currentRow && (
        <>
          <CrudActionDialog
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
            config={config}
          />

          <CrudDeleteDialog
            key={`crud-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
