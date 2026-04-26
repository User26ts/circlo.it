import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "PROJECT_URL",
  "sb_publishable_KEY"
)

export default supabase
