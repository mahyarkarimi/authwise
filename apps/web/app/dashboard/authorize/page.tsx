'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Card from '@/components/Card';

interface ClientInfo {
  name: string;
  logo?: string;
}

export default function Authorize() {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const scope = searchParams.get('scope');
  const state = searchParams.get('state');
  const responseType = searchParams.get('response_type');

  useEffect(() => {
    // In a real implementation, you would fetch client info from the backend
    // For now, we'll use mock data
    if (clientId) {
      setClientInfo({
        name: 'Sample OAuth Client',
        logo: 'https://via.placeholder.com/64'
      });
    }
    setLoading(false);
  }, [clientId]);

  const handleAuthorize = async () => {
    if (!clientId || !redirectUri) {
      setError('Missing required parameters');
      return;
    }

    try {
      // Redirect to the backend authorize endpoint
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: responseType || 'code',
        ...(scope && { scope }),
        ...(state && { state }),
      });

      window.location.href = `/api/auth/authorize?${params.toString()}`;
    } catch (err) {
      setError('Authorization failed');
    }
  };

  const handleDeny = () => {
    if (redirectUri) {
      const params = new URLSearchParams({
        error: 'access_denied',
        ...(state && { state }),
      });
      window.location.href = `${redirectUri}?${params.toString()}`;
    } else {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
            <Button onClick={() => router.push('/')}>
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          {clientInfo?.logo && (
            <img
              src={clientInfo.logo}
              alt="Client Logo"
              className="w-16 h-16 mx-auto mb-4 rounded-full"
            />
          )}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Authorization Request
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            <strong>{clientInfo?.name || 'Unknown Client'}</strong> is requesting access to your account.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            This application will be able to:
          </h3>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            {scope?.split(' ').map((s, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Access your {s.replace('_', ' ')}
              </li>
            )) || (
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Access your basic profile information
              </li>
            )}
          </ul>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handleDeny}
            variant="outline"
            className="flex-1"
          >
            Deny
          </Button>
          <Button
            onClick={handleAuthorize}
            className="flex-1"
          >
            Authorize
          </Button>
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>
            By authorizing this request, you allow this application to access your data according to their privacy policy.
          </p>
        </div>
      </Card>
    </div>
  );
}
