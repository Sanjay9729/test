const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY  // ✅ must use service role key
  );

  const body = JSON.parse(event.body);

  const { id, full_name, email, selected_product, phone, address } = body;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ID" }),
    };
  }

  console.log("🔄 Updating submission ID:", id);

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
    console.error("❌ Supabase update error:", error.message);
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
