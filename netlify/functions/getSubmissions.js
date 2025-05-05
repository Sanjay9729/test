const { createClient } = require("@supabase/supabase-js");

exports.handler = async function (event, context) {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase.from("submissions").select("*");

    if (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
