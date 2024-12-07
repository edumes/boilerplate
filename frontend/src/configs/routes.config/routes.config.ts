import { lazy } from 'react';
import authRoute from './authRoute';
import type { Routes } from '@/@types/routes';

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/pages/Home')),
        authority: [],
    },
    {
        key: 'customers.clients',
        path: '/customers/clients',
        component: lazy(() => import('@/pages/crud/customers/Clients')),
        authority: [],
    },
    // {
    //     key: 'customers.client_users',
    //     path: '/customers/client-users',
    //     component: lazy(() => import('@/views/customers/ClientUsers')),
    //     authority: [],
    // },
    // {
    //     key: 'projects.projects',
    //     path: '/projects',
    //     component: lazy(() => import('@/views/projects/Projects')),
    //     authority: [],
    // },
    // {
    //     key: 'projects.templates',
    //     path: '/projects/templates',
    //     component: lazy(() => import('@/views/projects/Templates')),
    //     authority: [],
    // },
    // {
    //     key: 'tasks',
    //     path: '/tasks',
    //     component: lazy(() => import('@/views/Tasks')),
    //     authority: [],
    // },
    // {
    //     key: 'sales.invoices',
    //     path: '/sales/invoices',
    //     component: lazy(() => import('@/views/sales/Invoices')),
    //     authority: [],
    // },
    // {
    //     key: 'sales.payments',
    //     path: '/sales/payments',
    //     component: lazy(() => import('@/views/sales/Payments')),
    //     authority: [],
    // },
    // {
    //     key: 'sales.estimates',
    //     path: '/sales/estimates',
    //     component: lazy(() => import('@/views/sales/Estimates')),
    //     authority: [],
    // },
    // {
    //     key: 'sales.subscriptions',
    //     path: '/sales/subscriptions',
    //     component: lazy(() => import('@/views/sales/Subscriptions')),
    //     authority: [],
    // },
    // {
    //     key: 'sales.products',
    //     path: '/sales/products',
    //     component: lazy(() => import('@/views/sales/Products')),
    //     authority: [],
    // },
    // {
    //     key: 'sales.expenses',
    //     path: '/sales/expenses',
    //     component: lazy(() => import('@/views/sales/Expenses')),
    //     authority: [],
    // },
    // {
    //     key: 'support.tickets',
    //     path: '/support/tickets',
    //     component: lazy(() => import('@/views/support/Tickets')),
    //     authority: [],
    // },
    // {
    //     key: 'support.canned',
    //     path: '/support/canned',
    //     component: lazy(() => import('@/views/support/Canned')),
    //     authority: [],
    // },
    // {
    //     key: 'support.knowledgebase',
    //     path: '/support/knowledgebase',
    //     component: lazy(() => import('@/views/support/Knowledgebase')),
    //     authority: [],
    // },
    // {
    //     key: 'support.messages',
    //     path: '/support/messages',
    //     component: lazy(() => import('@/views/support/Messages')),
    //     authority: [],
    // },
    // {
    //     key: 'team.team_members',
    //     path: '/team/members',
    //     component: lazy(() => import('@/views/team/TeamMembers')),
    //     authority: [],
    // },
    // {
    //     key: 'team.time_sheets',
    //     path: '/team/time-sheets',
    //     component: lazy(() => import('@/views/team/TimeSheets')),
    //     authority: [],
    // },
    // {
    //     key: 'reports',
    //     path: '/reports',
    //     component: lazy(() => import('@/views/Reports')),
    //     authority: [],
    // },
];
