// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tgfqeqqgzfwsvfivtkmd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnZnFlcXFnemZ3c3ZmaXZ0a21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDUxODUsImV4cCI6MjA1NzcyMTE4NX0.sb6TNc8Pd0LgqBXZxY_frfsMuqspqJjeL6szvVaOPWg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);