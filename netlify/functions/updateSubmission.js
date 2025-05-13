const { createClient } = require('@supabase/supabase-js');

// ✅ Replace these with your actual values
const SUPABASE_URL = 'https://uonsrhcedftrjoduwivq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbnNyaGNlZGZ0cmpvZHV3aXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDYyODY2NiwiZXhwIjoyMDYwMjA0NjY2fQ.Kizikx6i3QlpY5mPt3WUK-PXOyWAvKSdDAOavIj3c88';

// ❗ Never expose this key on the frontend
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

    console.log('Updating submission:', submission);

    // ✅ Validate required fields
    if (!submission.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing ID' }),
      };
    }

    const { data, error } = await supabase
      .from('warranty_submissions') // ✅ Your Supabase table name
      .update({
        full_name: submission.full_name,
        email: submission.email,
        selected_product: submission.selected_product,
        phone: submission.phone,
        address: submission.address,
      })
      .eq('id', submission.id);

    if (error) {
      console.error('Supabase error:', error.message);
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
    console.error('Server error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: err.message }),
    };
  }
};
