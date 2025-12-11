import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from '@/pages/Index';

// Mock PocketBase
vi.mock('@/integrations/pocketbase/client', () => ({
   pb: {
      authStore: {
         isValid: true,
         model: { id: 'test-user', name: 'Test Captain' },
         token: 'fake-token',
         onChange: vi.fn(() => () => { }),
         clear: vi.fn(),
      },
      collection: vi.fn(() => ({
         getFullList: vi.fn(() => Promise.resolve([])),
         subscribe: vi.fn(() => Promise.resolve(() => { })),
         unsubscribe: vi.fn(),
      })),
   },
   isAuthenticated: () => true,
   getCurrentUser: () => ({ id: 'test-user', name: 'Test Captain' }),
   onAuthChange: vi.fn(() => () => { }),
}));

// Mock Auth wrapper components
vi.mock('@/integrations/pocketbase/auth', () => ({
   getCurrentProfile: vi.fn(() => Promise.resolve({
      id: 'profile-1',
      maritime_role: 'captain',
      full_name: 'Test Captain'
   })),
}));

// Setup QueryClient
const queryClient = new QueryClient({
   defaultOptions: {
      queries: { retry: false },
   },
});

describe('SARDIN-AI App Smoke Test', () => {
   it('renders without crashing', () => {
      render(
         <QueryClientProvider client={queryClient}>
            <AuthProvider>
               <MemoryRouter>
                  <Index />
               </MemoryRouter>
            </AuthProvider>
         </QueryClientProvider>
      );

      // Basic expectation - if it renders Auth checking or Dashboard, it's alive
      // Since we mocked auth as valid, it should try to render dashboard components
      expect(document.body).toBeTruthy();
   });
});
