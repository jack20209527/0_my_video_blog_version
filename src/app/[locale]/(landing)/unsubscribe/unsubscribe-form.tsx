'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailFromUrl);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.code === 0) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to unsubscribe. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Unsubscribe</h1>
        <p className="mt-2 text-muted-foreground">
          We're sorry to see you go. Enter your email to unsubscribe from our newsletter.
        </p>
      </div>

      {status === 'success' ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-green-800">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleUnsubscribe} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          {status === 'error' && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
          </button>
        </form>
      )}
    </div>
  );
}
