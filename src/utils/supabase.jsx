// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';
//import { supabaseURL, supabaseKEY } from './secrets';

export const supabase = createClient("https://yvbdapvchprbxmhfpwli.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2YmRhcHZjaHByYnhtaGZwd2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNjI2NTMsImV4cCI6MjA1NDczODY1M30.8Ia9eOB3VjhT7Fa0KHlHxdrN2GipHFnFy11sMKXl4IQ");
