
// @deno-types="https://deno.land/x/xhr@0.1.0/mod.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image_url } = await req.json();

    if (!image_url) {
      return new Response(
        JSON.stringify({ error: "No image_url provided" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Download image as base64
    const resp = await fetch(image_url);
    const arrBuf = await resp.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrBuf)));

    const prompt = `
      You are an AI for extracting information from expense receipts.
      Extract and return a JSON with fields: merchant, amount, category, description, currency.
      The image is base64 encoded below: [BEGIN_IMAGE]${base64}[END_IMAGE]
      If data is missing, leave fields empty or null.
      Return only the JSON object, nothing else.
    `;

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a helpful assistant that extracts structured data from receipts."
        }, {
          role: "user",
          content: prompt
        }],
        max_tokens: 512,
        temperature: 0.1
      }),
    });

    const oaiData = await openaiResp.json();

    // Try to find and return JSON object from response
    const content = oaiData.choices?.[0]?.message?.content;
    let info = {};
    try {
      info = JSON.parse(content);
    } catch (_e) {
      info = { merchant: "", amount: "", category: "", description: "", currency: "" };
    }
    return new Response(JSON.stringify(info), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("OCR error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
