const { createClient } = require("@supabase/supabase-js");

const env = require("./env");

if (!env.supabaseUrl || !env.supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY must be set in backend/.env");
}

const supabase = createClient(env.supabaseUrl, env.supabaseKey);

module.exports = supabase;
