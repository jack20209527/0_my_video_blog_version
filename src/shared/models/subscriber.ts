'use server';

import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { subscriber } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type Subscriber = typeof subscriber.$inferSelect;

export async function createSubscriber(email: string): Promise<Subscriber> {
  const existing = await db()
    .select()
    .from(subscriber)
    .where(eq(subscriber.email, email))
    .limit(1);

  if (existing.length > 0) {
    if (existing[0].status === 'unsubscribed') {
      // 重新激活订阅
      const updated = await db()
        .update(subscriber)
        .set({
          status: 'active',
          updatedAt: new Date(),
        })
        .where(eq(subscriber.email, email))
        .returning();
      return updated[0];
    }
    return existing[0];
  }

  const result = await db()
    .insert(subscriber)
    .values({
      id: getUuid(),
      email,
      status: 'active',
    })
    .returning();

  return result[0];
}

export async function getAllActiveSubscribers(): Promise<Subscriber[]> {
  return db()
    .select()
    .from(subscriber)
    .where(eq(subscriber.status, 'active'));
}

export async function unsubscribe(email: string): Promise<void> {
  await db()
    .update(subscriber)
    .set({
      status: 'unsubscribed',
      updatedAt: new Date(),
    })
    .where(eq(subscriber.email, email));
}
