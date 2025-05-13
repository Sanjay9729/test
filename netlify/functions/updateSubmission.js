const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uonsrhcedftrjoduwivq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbnNyaGNlZGZ0cmpvZHV3aXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDYyODY2NiwiZXhwIjoyMDYwMjA0NjY2fQ.Kizikx6i3QlpY5mPt3WUK-PXOyWAvKSdDAOavIj3c88';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async function (event) {
  console.log('📥 Received event:', event.httpMethod);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const submission = JSON.parse(event.body);

    console.log('📝 Submission received:', submission);

    if (!submission.id) {
      console.error('❌ Missing ID in request body');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing ID in request body' }),
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
      console.error('❌ Supabase update error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    console.log('✅ Updated row:', data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Update successful', data }),
    };
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
