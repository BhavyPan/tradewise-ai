const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { quote, history } = await req.json();
    if (!quote?.symbol) {
      return new Response(JSON.stringify({ error: "Missing quote data" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are a cautious financial analysis assistant. Given live market data for a single stock, output a short-term recommendation (BUY, SELL, or HOLD) with a confidence score (0-100), risk level (Low, Medium, High), suggested holding period, and a 1-2 sentence plain-English reason citing the data. You never give personalized financial advice — frame it as educational analysis only.`;

    const userPrompt = `Stock: ${quote.symbol} (${quote.name})
Exchange: ${quote.exchange}
Current price: ${quote.price} ${quote.currency}
Change: ${quote.change?.toFixed?.(2)} (${quote.changePercent?.toFixed?.(2)}%)
Day range: ${quote.dayLow} – ${quote.dayHigh}
Open: ${quote.open}  Previous close: ${quote.previousClose}
Volume: ${quote.volume}
Last 5 daily closes: ${(history || []).join(", ")}

Analyze the trend and momentum, then return your recommendation via the function tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "emit_recommendation",
              description: "Return the recommendation for the stock.",
              parameters: {
                type: "object",
                properties: {
                  action: { type: "string", enum: ["BUY", "SELL", "HOLD"] },
                  confidence: { type: "number", description: "0-100 confidence" },
                  risk: { type: "string", enum: ["Low", "Medium", "High"] },
                  hold: { type: "string", description: "Suggested holding period, e.g. 'Exit now', '3-5 days', '1-2 weeks'" },
                  reason: { type: "string", description: "1-2 sentence reason citing the data" },
                },
                required: ["action", "confidence", "risk", "hold", "reason"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "emit_recommendation" } },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Lovable workspace settings." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = call?.function?.arguments ? JSON.parse(call.function.arguments) : null;
    if (!args) {
      return new Response(JSON.stringify({ error: "AI returned no recommendation" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stock-recommendation error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
