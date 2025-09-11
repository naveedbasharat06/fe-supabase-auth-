"use client"

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from "@emotion/react"
import theme from "@/theme"
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import ReduxProvider from '@/provider/redux/ReduxProvider'
import { useState } from 'react'

import { createBrowserSupabaseClient ,  type SupabaseClient } from '@supabase/auth-helpers-nextjs'
// import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ✅ Create supabase client once
  const [supabase] = useState(() => createBrowserSupabaseClient()) 
  


  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthProvider>
                {/* ✅ Correct usage: pass supabaseClient */}
                <SessionContextProvider supabaseClient={supabase}>
                  {children}
                </SessionContextProvider>
              </AuthProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
