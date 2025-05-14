const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  try {
    const { data } = JSON.parse(event.body);
    if (!Array.isArray(data) || data.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "No data found" }) };
    }

    const mapped = data.map(row => ({
      full_name: row.full_name,
      email: row.email,
      selected_product: row.product,
      phone: row.phone,
      address: row.address,
      created_at: row.created_at || new Date().toISOString(),
    }));

    const { error } = await supabase.from('submissions').insert(mapped);

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};


