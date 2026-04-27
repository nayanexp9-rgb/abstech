import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jassnvrpsmuwshvrekdv.supabase.co', 'sb_publishable_Pc3bqUmAC4THh0iC-065zw_ZUu9GP8I');

async function test() {
  const { data, error } = await supabase.from('quotes').insert({
    id: Date.now().toString(),
    name: 'Test',
    phone: '123',
    message: 'Test message',
    service: 'Test service'
  });
  console.log("Insert Data without status:", data);
  console.log("Insert Error without status:", error);
}

test();
