import { createClient } from '@supabase/supabase-js';
console.log("Initializing Supabase client...");
const supabaseUrl = 'https://mwzjrzamnrhmkdnpvixa.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
if (!supabaseKey) {
    console.error('Error: SUPABASE_KEY is missing in the environment variables.');
    throw new Error('SUPABASE_KEY is missing in the environment variables.');
}
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Supabase client successfully created!");
