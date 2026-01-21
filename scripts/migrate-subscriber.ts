import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = postgres(databaseUrl);

async function migrateSubscriber() {
  try {
    console.log('Creating subscriber table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS subscriber (
        id text PRIMARY KEY NOT NULL,
        email text NOT NULL UNIQUE,
        status text DEFAULT 'active' NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp NOT NULL
      )
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_subscriber_email_status 
      ON subscriber (email, status)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_subscriber_created_at 
      ON subscriber (created_at)
    `;
    
    console.log('✓ Subscriber table created successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

migrateSubscriber();
