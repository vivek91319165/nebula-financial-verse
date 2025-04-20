
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!groqApiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Get the user's financial data from the request
    const { user_id } = await req.json();

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
      .single();

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

    // Call Groq API for insights
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are a financial advisor analyzing user data. Provide 3 specific, actionable insights based on their financial data. Focus on spending patterns, savings opportunities, and investment suggestions. Be concise and specific.`
          },
          {
            role: 'user',
            content: `Analyze this financial data and provide 3 key insights: ${JSON.stringify(financialData)}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const groqResponse = await response.json();
    const insights = groqResponse.choices[0].message.content;

    // Store the insights in the database
    const { data: storedInsight, error: insertError } = await supabase
      .from('ai_insights')
      .insert({
        user_id,
        content: insights,
        insight_type: 'financial',
        is_read: false,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ insights: storedInsight }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating insights:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
