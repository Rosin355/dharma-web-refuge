#!/usr/bin/env tsx

import { completeBlogMigration } from './migrate-blog-complete.js';

console.log('🚀 Avvio Migrazione Blog Bodhidharma...\n');

completeBlogMigration()
  .then(() => {
    console.log('\n✅ Migrazione completata con successo!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Errore durante la migrazione:', error);
    process.exit(1);
  }); 