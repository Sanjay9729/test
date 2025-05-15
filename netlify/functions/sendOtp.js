const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body || '{}');

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email is required' }) };
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString(); // 10 minutes

  // Save OTP in Supabase
  const { error } = await supabase.from('email_otps').insert({ email, otp, expires_at: expiresAt });
  if (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Database error' }) };
  }

  // Send Email via Resend (or your email provider)
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Your App <your@email.com>',
      to: email,
      subject: 'Your OTP Code',
      html: `<h3>Your OTP is: <strong>${otp}</strong></h3>`,
    }),
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'OTP sent successfully' }),
  };
};
