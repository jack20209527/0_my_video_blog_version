import { Suspense } from 'react';
import UnsubscribeForm from './unsubscribe-form';

export default function UnsubscribePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <Suspense fallback={<div>Loading...</div>}>
        <UnsubscribeForm />
      </Suspense>
    </div>
  );
}
