// src/routes/index.tsx
import { RouteObject } from 'react-router-dom';
import MainLayout from '../layouts/mainlayout';
import HomePage from '../Pages/HomePage';
import Dashboard from '../Pages/Dashboard';
import Login from '../Pages/login';
// import Unauthorized from '../Pages/Unauthorized';
import { createBrowserRouter } from 'react-router-dom';

import { ProtectedRoute, GuestOnly } from '../middleware/middleware';
import  RegisterForm  from '../Pages/register';
import AuthCallback from '@/Pages/AuthCallback';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true, // This means "/"
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <GuestOnly>
        <Login />
      </GuestOnly>
    ),
  },
    {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
   {
    path: '/register',  // <-- new register route
    element: (
      <GuestOnly>
        <RegisterForm />
      </GuestOnly>
    ),
  },
  // {
  //   path: '/unauthorized',
  //   element: <Unauthorized />,
  // },
  {
    path: '*',
    element: <h1>404 - Page Not Found</h1>,
  },
];
const router = createBrowserRouter(routes);

export default router;
