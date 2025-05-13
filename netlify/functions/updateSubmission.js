// netlify/functions/updateSubmission.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://uonsrhcedftrjoduwivq.supabase.co'; // Replace this
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvbnNyaGNlZGZ0cmpvZHV3aXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDYyODY2NiwiZXhwIjoyMDYwMjA0NjY2fQ.Kizikx6i3QlpY5mPt3WUK-PXOyWAvKSdDAOavIj3c88'; // NEVER expose this on frontend

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' }),
    };
  }

  try {
    const updated = JSON.parse(event.body);

    const { data, error } = await supabase
      .from('warranty_submissions') // your table name
      .update({
        full_name: updated.full_name,
        email: updated.email,
        selected_product: updated.selected_product,
        phone: updated.phone,
        address: updated.address,
      })
      .eq('id', updated.id);

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
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }
};
