#!/usr/bin/env tsx
/**
 * Script per verificare se la migration 20251226200743_add_ceremony_files_and_email_queue.sql
 * è stata applicata correttamente sul database di produzione
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';

// Configurazione Supabase (stessa del client)
const SUPABASE_URL = 'https://zklgrmeiemzsusmoegby.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbGdybWVpZW16c3VzbW9lZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMzU4NDcsImV4cCI6MjA2NTgxMTg0N30.JTOpcuFKj4B1kGNL5CiES6TC7P-s9edHbubD9zEp5qA';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

interface VerificationResult {
  check: string;
  status: '✅' | '❌' | '⚠️';
  message: string;
  details?: any;
}

const results: VerificationResult[] = [];

async function checkCeremoniesColumns() {
  console.log('\n1️⃣ Verifica colonne audio_file_url e pdf_file_url in ceremonies...');
  
  try {
    // Prova a fare una query che include le colonne
    const { data, error } = await supabase
      .from('ceremonies')
      .select('id, audio_file_url, pdf_file_url')
      .limit(1);
    
    if (error) {
      // Se l'errore indica che la colonna non esiste
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        results.push({
          check: 'Colonne ceremonies (audio_file_url, pdf_file_url)',
          status: '❌',
          message: 'Le colonne audio_file_url e/o pdf_file_url non esistono nella tabella ceremonies',
          details: error.message
        });
        return;
      }
      // Altri errori (potrebbe essere solo che non ci sono record)
      if (error.code === 'PGRST116') {
        results.push({
          check: 'Colonne ceremonies (audio_file_url, pdf_file_url)',
          status: '✅',
          message: 'Le colonne esistono (tabella vuota)',
        });
        return;
      }
      throw error;
    }
    
    results.push({
      check: 'Colonne ceremonies (audio_file_url, pdf_file_url)',
      status: '✅',
      message: 'Le colonne audio_file_url e pdf_file_url esistono nella tabella ceremonies',
      details: data
    });
  } catch (err) {
    results.push({
      check: 'Colonne ceremonies (audio_file_url, pdf_file_url)',
      status: '❌',
      message: 'Errore durante la verifica delle colonne',
      details: err instanceof Error ? err.message : String(err)
    });
  }
}

async function checkEmailQueueTable() {
  console.log('\n2️⃣ Verifica tabella email_queue...');
  
  try {
    // Prova a fare una query sulla tabella email_queue
    const { data, error } = await supabase
      .from('email_queue')
      .select('id, to_email, subject, sent, created_at')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        results.push({
          check: 'Tabella email_queue',
          status: '❌',
          message: 'La tabella email_queue non esiste',
          details: error.message
        });
        return;
      }
      // Se l'errore è di permesso, la tabella esiste ma non abbiamo accesso (normale con RLS)
      if (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy')) {
        results.push({
          check: 'Tabella email_queue',
          status: '✅',
          message: 'La tabella email_queue esiste (errore di permesso normale con RLS)',
          details: 'La tabella esiste ma le policy RLS limitano l\'accesso (comportamento atteso)'
        });
        return;
      }
      throw error;
    }
    
    results.push({
      check: 'Tabella email_queue',
      status: '✅',
      message: 'La tabella email_queue esiste ed è accessibile',
      details: `Trovati ${data?.length || 0} record`
    });
  } catch (err) {
    results.push({
      check: 'Tabella email_queue',
      status: '❌',
      message: 'Errore durante la verifica della tabella email_queue',
      details: err instanceof Error ? err.message : String(err)
    });
  }
}

async function checkEmailQueueRLS() {
  console.log('\n3️⃣ Verifica RLS sulla tabella email_queue...');
  
  try {
    // Prova a fare una query senza autenticazione (dovrebbe fallire con RLS)
    const { error } = await supabase
      .from('email_queue')
      .select('*')
      .limit(1);
    
    // Se otteniamo un errore di permesso, significa che RLS è attivo
    if (error && (error.code === '42501' || error.message.includes('permission') || error.message.includes('policy'))) {
      results.push({
        check: 'RLS su email_queue',
        status: '✅',
        message: 'RLS è attivo sulla tabella email_queue (comportamento atteso)',
      });
    } else if (error && error.message.includes('does not exist')) {
      results.push({
        check: 'RLS su email_queue',
        status: '❌',
        message: 'La tabella email_queue non esiste',
      });
    } else {
      results.push({
        check: 'RLS su email_queue',
        status: '⚠️',
        message: 'Impossibile verificare RLS (potrebbe essere disabilitato o non configurato)',
        details: error?.message
      });
    }
  } catch (err) {
    results.push({
      check: 'RLS su email_queue',
      status: '⚠️',
      message: 'Errore durante la verifica RLS',
      details: err instanceof Error ? err.message : String(err)
    });
  }
}

async function checkFunctions() {
  console.log('\n4️⃣ Verifica funzioni SQL (send_event_registration_email, notify_event_registration, notify_ceremony_registration)...');
  
  // Non possiamo verificare direttamente le funzioni SQL tramite il client Supabase
  // ma possiamo verificare se i trigger funzionano testando un inserimento
  // Per ora segnaliamo che serve verifica manuale
  
  results.push({
    check: 'Funzioni SQL',
    status: '⚠️',
    message: 'Verifica manuale richiesta nel dashboard Supabase',
    details: 'Controlla nel SQL Editor di Supabase se esistono: send_event_registration_email, notify_event_registration, notify_ceremony_registration'
  });
}

async function checkTriggers() {
  console.log('\n5️⃣ Verifica trigger (on_event_registration_created, on_ceremony_registration_created)...');
  
  // Non possiamo verificare direttamente i trigger tramite il client
  // Segnaliamo che serve verifica manuale
  
  results.push({
    check: 'Trigger SQL',
    status: '⚠️',
    message: 'Verifica manuale richiesta nel dashboard Supabase',
    details: 'Controlla nel SQL Editor di Supabase se esistono i trigger: on_event_registration_created, on_ceremony_registration_created'
  });
}

async function testEmailFunction() {
  console.log('\n6️⃣ Test funzione send_event_registration_email (se possibile)...');
  
  try {
    // Prova a chiamare la funzione (potrebbe non funzionare con ANON_KEY)
    const { data, error } = await supabase.rpc('send_event_registration_email', {
      p_to_email: 'test@example.com',
      p_participant_name: 'Test User',
      p_event_title: 'Test Event',
      p_event_date: '01/01/2024 10:00',
      p_event_location: 'Test Location'
    });
    
    if (error) {
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        results.push({
          check: 'Funzione send_event_registration_email',
          status: '❌',
          message: 'La funzione send_event_registration_email non esiste',
          details: error.message
        });
      } else if (error.message.includes('permission') || error.code === '42501') {
        results.push({
          check: 'Funzione send_event_registration_email',
          status: '✅',
          message: 'La funzione esiste (errore di permesso normale - funzione SECURITY DEFINER)',
          details: 'La funzione esiste ma richiede permessi elevati (comportamento atteso)'
        });
      } else {
        results.push({
          check: 'Funzione send_event_registration_email',
          status: '⚠️',
          message: 'Errore durante il test della funzione',
          details: error.message
        });
      }
    } else {
      results.push({
        check: 'Funzione send_event_registration_email',
        status: '✅',
        message: 'La funzione send_event_registration_email esiste e funziona',
        details: data
      });
    }
  } catch (err) {
    results.push({
      check: 'Funzione send_event_registration_email',
      status: '⚠️',
      message: 'Errore durante il test',
      details: err instanceof Error ? err.message : String(err)
    });
  }
}

async function main() {
  console.log('🔍 Verifica Migration: 20251226200743_add_ceremony_files_and_email_queue.sql\n');
  console.log('Connessione a:', SUPABASE_URL);
  
  // Test connessione
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1);
    if (error && !error.message.includes('permission')) {
      throw error;
    }
    console.log('✅ Connessione al database riuscita\n');
  } catch (err) {
    console.error('❌ Errore connessione:', err);
    process.exit(1);
  }
  
  // Esegui tutti i check
  await checkCeremoniesColumns();
  await checkEmailQueueTable();
  await checkEmailQueueRLS();
  await checkFunctions();
  await checkTriggers();
  await testEmailFunction();
  
  // Mostra risultati
  console.log('\n' + '='.repeat(60));
  console.log('📊 RISULTATI VERIFICA MIGRATION');
  console.log('='.repeat(60) + '\n');
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.status} ${result.check}`);
    console.log(`   ${result.message}`);
    if (result.details) {
      console.log(`   Dettagli: ${typeof result.details === 'object' ? JSON.stringify(result.details, null, 2) : result.details}`);
    }
    console.log('');
  });
  
  // Riepilogo
  const successCount = results.filter(r => r.status === '✅').length;
  const errorCount = results.filter(r => r.status === '❌').length;
  const warningCount = results.filter(r => r.status === '⚠️').length;
  
  console.log('='.repeat(60));
  console.log('📈 RIEPILOGO:');
  console.log(`   ✅ Successi: ${successCount}`);
  console.log(`   ❌ Errori: ${errorCount}`);
  console.log(`   ⚠️  Warning: ${warningCount}`);
  console.log('='.repeat(60) + '\n');
  
  if (errorCount > 0) {
    console.log('❌ La migration NON è stata applicata completamente.');
    console.log('   Esegui la migration nel dashboard Supabase:\n');
    console.log('   1. Vai su https://supabase.com/dashboard');
    console.log('   2. Seleziona il progetto');
    console.log('   3. Vai su SQL Editor');
    console.log('   4. Copia e incolla il contenuto di:');
    console.log('      supabase/migrations/20251226200743_add_ceremony_files_and_email_queue.sql');
    console.log('   5. Esegui la query\n');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('⚠️  La migration sembra applicata, ma verifica manualmente:');
    console.log('   - Funzioni SQL nel dashboard Supabase');
    console.log('   - Trigger SQL nel dashboard Supabase\n');
    process.exit(0);
  } else {
    console.log('✅ La migration è stata applicata correttamente!\n');
    process.exit(0);
  }
}

main().catch(console.error);

