const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uonsrhcedftrjoduwivq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbnNyaGNlZGZ0cmpvZHV3aXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDYyODY2NiwiZXhwIjoyMDYwMjA0NjY2fQ.Kizikx6i3QlpY5mPt3WUK-PXOyWAvKSdDAOavIj3c88';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const updated = JSON.parse(event.body);

    // ✅ Check if ID exists
    if (!updated.id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing ID in request body' }),
      };
    }

    const { data, error } = await supabase
      .from('warranty_submissions')
      .update({
        full_name: updated.full_name,
        email: updated.email,
        selected_product: updated.selected_product,
        phone: updated.phone,
        address: updated.address,
      })
      .eq('id', updated.id);

    if (error) {
      console.error('Supabase update error:', error);
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
    console.error('Function crashed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message }),
    };
  }
};
