import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
// import { api } from '@/lib/api';
// import { useQuery } from '@tanstack/react-query';
import { CrudDialogs } from './components/crud-dialogs';
import { CrudPrimaryButtons } from './components/crud-primary-buttons';
import { CrudTable } from './components/crud-table';
import { columns } from './components/crud-columns';
import CrudProvider from './context/crud-context';
import { users } from './data/users';
import { userListSchema } from './data/schema';

export default function Crud() {
  const userList = userListSchema.parse(users);

  // const { data: columns } = useQuery({
  //   queryKey: ['projects-fields'],
  //   queryFn: async () => {
  //     const response = await api.get('/projects/fields');
  //     return response.data;
  //   },
  // });

  // const { data: projects } = useQuery({
  //   queryKey: ['projects-data'],
  //   queryFn: async () => {
  //     const response = await api.get('/projects');
  //     return response.data;
  //   },
  // });
  // console.log({ projects });

  return (
    <CrudProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <CrudPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CrudTable data={userList} columns={columns} />
        </div>
      </Main>

      <CrudDialogs />
    </CrudProvider>
  );
}
