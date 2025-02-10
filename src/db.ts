import { createClient } from '@supabase/supabase-js'

// Example server-side log
console.log("Initializing Supabase client...")

const supabaseUrl: string = 'https://mwzjrzamnrhmkdnpvixa.supabase.co'
const supabaseKey: string | undefined = process.env.SUPABASE_KEY


if (!supabaseKey) {
  console.error('Error: SUPABASE_KEY is missing in the environment variables.')
  throw new Error('SUPABASE_KEY is missing in the environment variables.')
}

const supabase = createClient(supabaseUrl, supabaseKey)


console.log("Supabase client successfully created!")



