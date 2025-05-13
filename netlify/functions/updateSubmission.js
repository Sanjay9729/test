const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const data = JSON.parse(event.body);

  if (!data.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ID for update" }),
    };
  }

  const { id, full_name, email, selected_product, phone, address } = data;

  const { error } = await supabase
    .from("submissions")
    .update({
      full_name,
      email,
      selected_product,
      phone,
      address,
    })
    .eq("id", id);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Update successful" }),
  };
};
