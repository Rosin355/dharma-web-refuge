#!/usr/bin/env tsx

import { importArticlesToDatabase, testDatabaseConnection } from './import-to-database.js';

console.log('🚀 Avvio importazione articoli nel database...\n');

const main = async () => {
  const isConnected = await testDatabaseConnection();
  if (isConnected) {
    await importArticlesToDatabase();
  } else {
    console.error('❌ Impossibile connettersi al database. Verifica le credenziali.');
  }
};

main()
  .then(() => {
    console.log('\n✅ Importazione completata!');
  })
  .catch((error) => {
    console.error('\n❌ Errore durante l\'importazione:', error);
  }); 