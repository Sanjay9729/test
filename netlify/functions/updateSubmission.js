const { createClient } = require('@supabase/supabase-js');

// ✅ Your Supabase credentials
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const submission = JSON.parse(event.body);

    if (!submission.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing ID' }),
      };
    }

    const { data, error } = await supabase
      .from('warranty_submissions')
      .update({
        full_name: submission.full_name,
        email: submission.email,
        selected_product: submission.selected_product,
        phone: submission.phone,
        address: submission.address,
      })
      .eq('id', submission.id);

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Updated successfully', data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error', detail: err.message }),
    };
  }
};
