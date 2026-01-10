// ============================================================================
// Infrastructure Layer - Supabase Client
// ============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// These values should be set in environment variables
// For Vite, use import.meta.env.VITE_SUPABASE_URL, etc.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️ Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for type safety
export type { SupabaseClient };
