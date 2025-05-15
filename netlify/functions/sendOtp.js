const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { email, full_name, phone, address, selected_product } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email is required' }),
      };
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Insert OTP and user info into Supabase
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
      console.error('❌ Supabase insert error:', error.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Database error' }),
      };
    }

    // Send OTP email using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Warranty App <onboarding@resend.dev>',
        to: email,
        subject: 'Your OTP Code',
        html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>It will expire in 10 minutes.</p>`,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error("❌ Resend API error:", errText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to send OTP email' }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OTP sent successfully' }),
    };
  } catch (err) {
    console.error("❌ Unhandled error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
