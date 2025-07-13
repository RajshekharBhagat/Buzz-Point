'use client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderType {
    children: React.ReactNode;
}

const QueryProvider = ({children}:QueryProviderType) => {

    const queryClient = new QueryClient();

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider;