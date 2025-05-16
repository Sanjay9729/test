// const { createClient } = require('@supabase/supabase-js');
// const fetch = require('node-fetch');

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// exports.handler = async (event) => {
//   const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

//   try {
//     const { email } = JSON.parse(event.body || '{}');

//     if (!email) {
//       return {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ error: 'Email is required' }),
//       };
//     }

//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

//     const { error } = await supabase
//       .from('email_otps')
//       .insert([{ email, otp, expires_at: expiresAt }]);

//     if (error) {
//       console.error("Supabase insert error:", error.message);
//       return {
//         statusCode: 500,
//         headers,
//         body: JSON.stringify({ error: error.message }),
//       };
//     }

//     const emailRes = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         from: 'Warranty App <onboarding@resend.dev>',
//         to: 'sanjayvaghela.029@gmail.com',
//         subject: 'Your OTP Code',
//         html: `<h3>Your OTP is: <strong>${otp}</strong></h3>`,
//       }),
//     });

//     const emailData = await emailRes.json();

//     if (!emailRes.ok) {
//       console.error("Email send error:", emailData);
//       return {
//         statusCode: 500,
//         headers,
//         body: JSON.stringify({ error: "Email sending failed", detail: emailData }),
//       };
//     }

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({ message: 'OTP sent successfully' }),
//     };
//   } catch (err) {
//     console.error("Unexpected error:", err.message);
//     return {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ error: 'Server error', detail: err.message }),
//     };
//   }
// };












// // Updated : 15-05-2025

// const { createClient } = require('@supabase/supabase-js');
// const fetch = require('node-fetch');

// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// exports.handler = async (event) => {
//   const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

//   try {
//     const { email, full_name, phone, address, selected_product } = JSON.parse(event.body || '{}');

//     // Validate email
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!email || !emailRegex.test(email)) {
//       return {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ error: 'Valid email is required' }),
//       };
//     }

//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

//     // Insert OTP into Supabase
//     const { error } = await supabase
//       .from('email_otps')
//       .insert([{ email, otp, expires_at: expiresAt, full_name, phone, address, selected_product }]);

//     if (error) {
//       console.error('Supabase insert error:', error.message);
//       return {
//         statusCode: 500,
//         headers,
//         body: JSON.stringify({ error: 'Failed to store OTP', detail: error.message }),
//       };
//     }

//     console.log(`Sending OTP ${otp} to ${email}`);

//     // Send email via Resend
//     const emailRes = await fetch('https://api.resend.com/emails', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         from: 'sanjay.vaghela@appunik.com', // Replace with your verified domain
//         to: email,
//         subject: 'Your OTP Code',
//         html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>It is valid for 10 minutes.</p>`,
//       }),
//     });

//     const emailData = await emailRes.json();

//     if (!emailRes.ok) {
//       console.error('Email send error:', emailData);
//       return {
//         statusCode: 403,
//         headers,
//         body: JSON.stringify({
//           error: 'Email sending failed',
//           detail: emailData.message || 'Check Resend API configuration',
//         }),
//       };
//     }

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({ message: 'OTP sent successfully' }),
//     };
//   } catch (err) {
//     console.error('Unexpected error:', err.message);
//     return {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ error: 'Server error', detail: err.message }),
//     };
//   }
// };














// -----------------------------------------------------------------------



// Updated : 16-05-2025

const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.handler = async (event) => {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  try {
    const { email, full_name, phone, address, selected_product } = JSON.parse(event.body || '{}');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email is required' }),
      };
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000).toISOString();

    // Only insert fields that exist in your table
    const { error } = await supabase
      .from('email_otps')
      .insert([{ email, otp, expires_at: expiresAt }]);

    if (error) {
      console.error('Supabase insert error:', error.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to store OTP', detail: error.message }),
      };
    }

    // Optionally, store the user details in a session variable or another table
    // if you need to use them later
    
    console.log(`Sending OTP ${otp} to ${email}`);

    // Send email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Replace with your verified domain
        to: email,
        subject: 'Your OTP Code',
        html: `<h3>Your OTP is: <strong>${otp}</strong></h3><p>It is valid for 10 minutes.</p>`,
      }),
    });

    const emailData = await emailRes.json();

    if (!emailRes.ok) {
      console.error('Email send error:', emailData);
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: 'Email sending failed',
          detail: emailData.message || 'Check Resend API configuration',
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'OTP sent successfully' }),
    };
  } catch (err) {
    console.error('Unexpected error:', err.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error', detail: err.message }),
    };
  }
};