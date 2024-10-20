// app/providers.tsx
'use client'
import { useState } from 'react';
import {NextUIProvider} from '@nextui-org/react';
import {useRouter} from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export function Providers({children}) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient())
  return (
  <QueryClientProvider client={queryClient}>
  <ReactQueryDevtools />
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider enableSystem={false} >
          <Toaster position="bottom-right" reverseOrder={false} />
          <NextTopLoader color="#000000"/>
          <AuthProvider>
          <ProtectedRoute>
          {children}
          </ProtectedRoute>
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  </QueryClientProvider>
  )
}