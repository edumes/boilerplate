import { HTMLAttributes } from 'react';
import { z } from 'zod';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password'
    })
    .min(4, {
      message: 'Password must be at least 4 characters long'
    })
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { setAccessToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: 'admin@admin.com',
      password: '1234'
    }
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => authService.login(data.email, data.password),
    onSuccess: response => {
      console.log(response);
      setAccessToken(response.token);
      setUser(response.user);
      navigate('/');
    },
    onError: (error: AxiosError) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error: ' + error.code,
        description: error.message
      });
    }
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    login(data);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isPending}>
              Login
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button variant='outline' className='w-full' type='button' disabled={isPending}>
                <IconBrandGithub className='h-4 w-4' /> GitHub
              </Button>
              <Button variant='outline' className='w-full' type='button' disabled={isPending}>
                <IconBrandFacebook className='h-4 w-4' /> Facebook
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
