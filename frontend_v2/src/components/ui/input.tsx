import { cn } from '@/lib/utils';
import type { InputRef } from 'antd';
import { Input as AntdInput } from 'antd';
import * as React from 'react';

const Input = React.forwardRef<
  InputRef,
  React.ComponentProps<typeof AntdInput>
>(({ className, type, ...props }, ref) => {
  return (
    <AntdInput
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent hover:bg-transparent focus:bg-transparent px-3 py-1 text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
