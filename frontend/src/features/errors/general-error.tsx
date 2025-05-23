import { useNavigate, useRouter } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean;
  error?: unknown;
}

export default function GeneralError({ className, minimal = false, error }: GeneralErrorProps) {
  const navigate = useNavigate();
  const { history } = useRouter();

  const errorName = error instanceof Error ? error.name : 'Unknown Error';
  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  const errorStack = error instanceof Error && error.stack ? error.stack : '';

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-4 p-6'>
        {!minimal && <h1 className='text-[7rem] font-bold leading-tight'>500</h1>}

        <span className='font-medium text-xl'>Oops! Something went wrong {`:')`}</span>

        <div className='bg-red-100 border border-red-400 text-red-700 px-8 py-3 rounded-md max-w-lg text-center shadow-md'>
          <strong>{errorName}:</strong> {errorMessage}
        </div>

        {!minimal && errorStack && (
          <Accordion type='single' collapsible className='w-full max-w-lg mt-4'>
            <AccordionItem value='error-details'>
              <AccordionTrigger>Show Error Details</AccordionTrigger>
              <AccordionContent>
                <pre className='p-4 bg-gray-800 text-white rounded-md overflow-auto max-h-60 text-sm shadow-inner'>
                  {errorStack}
                </pre>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => history.go(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  );
}
