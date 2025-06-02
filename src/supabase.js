import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dycoiqkzdnszgdsmnflr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5Y29pcWt6ZG5zemdkc21uZmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MDI2MjIsImV4cCI6MjA2NDQ3ODYyMn0.Nd4MbMdDhR8MeSo8q4mfdtl23KiC1UdZ4h8PIIPuqYY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);