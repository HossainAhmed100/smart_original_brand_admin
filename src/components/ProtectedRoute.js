// components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@nextui-org/react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated , isLoading} = useAuth();
  const router = useRouter();

  // Render children only if authenticated
  if (isLoading) {
    return <div className='w-full min-h-screen flex items-center justify-center'><Spinner /></div>;  // Show a loading spinner or null until auth state is verified
  }else if(!isAuthenticated){
    router.push('/login');
  }

  return children;
};

export default ProtectedRoute;
