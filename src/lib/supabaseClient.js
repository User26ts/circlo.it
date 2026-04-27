import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://YOUR_PROJECT_URL.supabase.co",  // Sostituisci con la tua URL
  "sb_publishable_YOUR_PUBLISHABLE_KEY"   // Sostituisci con la tua publishable key
)

export default supabase
