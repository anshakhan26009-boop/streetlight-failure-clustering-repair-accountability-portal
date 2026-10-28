require('dotenv').config();
const {createClient}=require('@supabase/supabase-js');
const url=process.env.SUPABASE_URL, anon=process.env.SUPABASE_ANON_KEY, service=process.env.SUPABASE_SERVICE_ROLE_KEY;
function make(key){if(!url||!key)throw Object.assign(new Error('Supabase is not configured. Copy .env.example to .env and add project credentials.'),{status:503,code:'SUPABASE_NOT_CONFIGURED'});return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})}
module.exports={userClient:()=>make(anon),adminClient:()=>make(service)};
