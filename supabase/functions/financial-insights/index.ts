
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!groqApiKey) {
    console.error('GROQ_API_KEY not configured');
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse the request body
    const requestData = await req.json();
    const { user_id, message, type } = requestData;

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Fetch user's financial data
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user_id);

    const { data: balances } = await supabase
      .from('balances')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle();

    const { data: wallets } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)
      .eq('is_active', true);

    // Prepare data for analysis
    const financialData = {
      total_balance: balances?.total_balance || 0,
      expenses: expenses || [],
      wallets: wallets || [],
    };

    // Set the system prompt based on the request type
    let systemPrompt = '';
    if (type === 'chat') {
      systemPrompt = `You are a helpful financial assistant. Use this financial data to provide specific, personalized advice: ${JSON.stringify(financialData)}. Be concise and practical in your responses.`;
    } else {
      systemPrompt = `You are a financial advisor analyzing user data. Provide 3 specific, actionable insights based on their financial data. Focus on spending patterns, savings opportunities, and investment suggestions. Be concise and specific.`;
    }

    // Call Groq API with updated model
    console.log(`Calling Groq API with system prompt: ${systemPrompt.substring(0, 100)}...`);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Updated model that is currently available
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message || 'Analyze this financial data and provide 3 key insights'
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Groq API error: ${errorData.error?.message || errorData.message || 'Unknown error'}`);
      } catch (e) {
        throw new Error(`Groq API error: ${response.status} - ${errorText.substring(0, 100)}`);
      }
    }

    const groqResponse = await response.json();
    
    // Check if the expected properties exist
    if (!groqResponse || !groqResponse.choices || !groqResponse.choices[0] || !groqResponse.choices[0].message) {
      console.error('Unexpected Groq API response format:', JSON.stringify(groqResponse).substring(0, 200));
      throw new Error('Unexpected response format from Groq API');
    }
    
    const content = groqResponse.choices[0].message.content;

    if (type === 'chat') {
      return new Response(
        JSON.stringify({ message: content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store insights in the database for non-chat responses
    const { data: storedInsight, error: insertError } = await supabase
      .from('ai_insights')
      .insert({
        user_id,
        content,
        insight_type: 'financial',
        is_read: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing insight:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ insights: storedInsight }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating insights:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
