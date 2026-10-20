// Script to run migration via Supabase Management API
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://nmijafylcoajmehelolk.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taWphZnlsY29ham1laGVsb2xrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI2NDA2NSwiZXhwIjoyMDkxODQwMDY1fQ.cAyOZ1zMQjMXnDvfyILHhVvLKeVvOEwrikOW7LGEijk';
const DB_PASSWORD = 'Pickleball@123';

// Split the SQL into individual statements
const sqlFile = fs.readFileSync(path.join(__dirname, '..', 'supabase-migration.sql'), 'utf8');

// We'll use the Supabase SQL endpoint via the pg_net extension or direct query
// Since we can't use psql, we'll use the Supabase HTTP API to execute SQL

async function runSQL(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  });
  return response;
}

// Alternative: Use the Supabase Management API SQL endpoint
async function runMigration() {
  console.log('Running migration via Supabase...');
  
  // Split SQL into statements (handling $$ blocks)
  const statements = [];
  let current = '';
  let inDollarQuote = false;
  
  for (const line of sqlFile.split('\n')) {
    if (line.trim().startsWith('--')) {
      continue; // skip comments
    }
    
    if (line.includes('$$')) {
      const count = (line.match(/\$\$/g) || []).length;
      if (count === 1) {
        inDollarQuote = !inDollarQuote;
      }
    }
    
    current += line + '\n';
    
    if (!inDollarQuote && line.trim().endsWith(';')) {
      const stmt = current.trim();
      if (stmt && stmt !== ';') {
        statements.push(stmt);
      }
      current = '';
    }
  }
  
  if (current.trim()) {
    statements.push(current.trim());
  }

  console.log(`Found ${statements.length} SQL statements to execute`);
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 80).replace(/\n/g, ' ');
    console.log(`\n[${i + 1}/${statements.length}] Executing: ${preview}...`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({})
      });
    } catch (err) {
      // Expected to fail - we need a different approach
    }
  }
  
  console.log('\n⚠️  Direct SQL execution via REST API is not supported.');
  console.log('📋 Please run the migration manually:');
  console.log('   1. Go to https://supabase.com/dashboard/project/nmijafylcoajmehelolk/sql');
  console.log('   2. Copy the contents of supabase-migration.sql');
  console.log('   3. Paste and click "Run"');
  console.log('\n   Or install psql: brew install postgresql');
}

runMigration().catch(console.error);
