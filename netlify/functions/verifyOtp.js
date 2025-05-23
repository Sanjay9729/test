// const { createClient } = require('@supabase/supabase-js');

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// exports.handler = async (event) => {
//   const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

//   const { email, otp } = JSON.parse(event.body || '{}');

//   if (!email || !otp) {
//     return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing email or OTP' }) };
//   }

//   const { data, error } = await supabase
//     .from('email_otps')
//     .select('*')
//     .eq('email', email)
//     .eq('otp', otp)
//     .order('created_at', { ascending: false })
//     .limit(1);

//   if (error || !data.length) {
//     return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid OTP' }) };
//   }

//   const isExpired = new Date(data[0].expires_at) < new Date();
//   if (isExpired) {
//     return { statusCode: 401, headers, body: JSON.stringify({ error: 'OTP expired' }) };
//   }

//   return { statusCode: 200, headers, body: JSON.stringify({ message: 'OTP verified' }) };
// };



