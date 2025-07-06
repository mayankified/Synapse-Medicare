import { useAuth } from '@/context/auth-context';
import { Navigate } from 'react-router-dom';
import { Sidebar } from './sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  console.log('User:', user);
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}