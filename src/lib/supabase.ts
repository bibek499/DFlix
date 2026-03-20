import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    'https://fkwyhmywomhwszlhxdvk.supabase.co',
    'sb_publishable_TxNwySIbSv7fPJf_1rZMmQ_ti6u9i6F'
  );
}

export const createSupabaseBrowserClient = createClient;