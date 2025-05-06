/**
 * Test script for checking Supabase connection
 * 
 * Run with: node src/lib/test-connection.js
 */

import { createClient } from '@supabase/supabase-js';

// Force HTTPS to avoid DNS resolution issues
const supabaseUrl = 'https://apocdhxpexpcnzcjzpvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwb2NkaHhwZXhwY256Y2p6cHZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc3MzYxNDIsImV4cCI6MjAzMzMxMjE0Mn0.7DPzdYRYAJnhgzVISftJrRCpq17RGDKxm5HzYcqXQVE';

// Create a simple Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // Try to get the current session
    console.log('Testing auth service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth service error:', authError);
    } else {
      console.log('✅ Auth service is working');
      console.log('Current session:', authData.session ? 'Active' : 'None');
    }
    
    // Try to query a table
    console.log('\nTesting database service...');
    const { data: dbData, error: dbError } = await supabase
      .from('communities')
      .select('count')
      .limit(1);
      
    if (dbError) {
      console.error('❌ Database service error:', dbError);
    } else {
      console.log('✅ Database service is working');
      console.log('Query result:', dbData);
    }
    
    // Try to test storage
    console.log('\nTesting storage service...');
    const { data: storageData, error: storageError } = await supabase
      .storage
      .listBuckets();
      
    if (storageError) {
      console.error('❌ Storage service error:', storageError);
    } else {
      console.log('✅ Storage service is working');
      console.log('Available buckets:', storageData.length);
    }
    
    // Summary
    if (authError || dbError || storageError) {
      console.log('\n❌ Some Supabase services are not working correctly');
      console.log('This might be due to DNS resolution issues or network configuration');
      console.log('The application will use mock data as a fallback');
    } else {
      console.log('\n✅ All Supabase services are working correctly');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed with error:', error);
    console.log('The application will use mock data as a fallback');
  }
}

testConnection(); 