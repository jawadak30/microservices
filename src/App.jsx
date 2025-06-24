import React from 'react';
import axiosInstance from './Api/axiosInstance';
import { RouterProvider } from 'react-router-dom';
import router from './Routes/AppRoutes';
import { AuthProvider } from './Authcontext/AuthContext';
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeInitializer } from './middleware/ThemeInitializer';

function App() {
  return (
    <ThemeInitializer>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </ThemeInitializer>
  );
}

export default App;
