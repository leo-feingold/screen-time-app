// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vwhktwcefllzgaxsphfs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3aGt0d2NlZmxsemdheHNwaGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMzQ5OTQsImV4cCI6MjA2OTgxMDk5NH0.qo2Pb7jWlKUOyH4FkfBEJaCLt6edHRH64ESKQGbR0xo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
