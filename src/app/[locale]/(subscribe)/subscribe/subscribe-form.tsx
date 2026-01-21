'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

export function SubscribeForm({ action }: { action: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!resp.ok) {
        throw new Error(`Request failed with status ${resp.status}`);
      }

      const { code, message } = await resp.json();
      if (code !== 0) {
        throw new Error(message);
      }

      toast.success(message || 'Successfully subscribed!');
      setEmail('');
    } catch (e: any) {
      toast.error(e.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            type="email"
            className="h-11 md:h-12 text-base md:text-lg"
            placeholder="Enter your email address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="h-11 md:h-12 px-4 md:px-6 text-base md:text-lg"
          disabled={loading}
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}
