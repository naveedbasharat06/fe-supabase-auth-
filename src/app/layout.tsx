"use client"


import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from "@emotion/react";
import theme from "@/theme";
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ReduxProvider from '@/provider/redux/ReduxProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <ReduxProvider>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
            {children}
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
