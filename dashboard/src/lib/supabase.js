import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://coirvhmbifzpliypiblw.supabase.co";

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_gnxBTPwuiZy9xR1-Qihggw_AYD1W5u0";

export const supabase = createClient(supabaseUrl, supabaseKey);
