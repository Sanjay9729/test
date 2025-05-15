const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { email, full_name, phone, address, selected_product } = JSON.parse(event.body || '{}');

    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email is required' }) };
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    const { error } = await supabase.from('email_otps').insert([
      {
        email,
        otp,
        expires_at: expiresAt,
        full_name,
        phone,
        address,
        selected_product,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database error' }),
      };
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Warranty App <onboarding@resend.dev>',
        to: email,
        subject: 'Your OTP Code',
        html: `<h3>Your OTP is: <strong>${otp}</strong></h3>`,
      }),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OTP sent successfully' }),
    };
  } catch (err) {
    console.error("Unhandled error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};


