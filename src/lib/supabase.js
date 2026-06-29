import { createClient } from '@supabase/supabase-js';

// Hardcoded public credentials to bypass Vercel environment variable bugs
const supabaseUrl = 'https://azviiiqrfqbbbjigzrwm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6dmlpaXFyZnFiYmJqaWd6cndtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjUxNDUsImV4cCI6MjA5MzgwMTE0NX0.4-U92kSwzreJh8O5wr0nfIfL81xDD3TwlS15Vt0T5cs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
