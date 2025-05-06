const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
  console.log("▶️ getSubmissions triggered");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing environment variables");
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase.from("submissions").select("*");

    if (error) {
      console.error("❌ Supabase Error:", error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    console.log("✅ Data fetched:", data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("❌ Unexpected Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Function failed unexpectedly" }),
    };
  }
};
