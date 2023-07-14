import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://roptjhzpicznjoukcryc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcHRqaHpwaWN6bmpvdWtjcnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyNjEyMzgsImV4cCI6MjAwNDgzNzIzOH0.HBzfsuK4ZyQxfz6f3oX-u8XpjbaC-sw9L1-m4qFeyXg";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;