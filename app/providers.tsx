"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos - datos se consideran frescos
            gcTime: 10 * 60 * 1000, // 10 minutos - tiempo antes de limpiar caché
            retry: 2, // Reintentar 2 veces en caso de error
            refetchOnWindowFocus: false, // No refetch al volver a la ventana
            refetchOnReconnect: true, // Sí refetch al reconectar internet
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
