// Tota AI Chat Edge Function

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: Message[];
  projectContext?: {
    projectName?: string;
    currentPages?: string[];
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, projectContext } = (await req.json()) as ChatRequest;

    // Build the system prompt for Tota AI
    const systemPrompt = `You are Tota AI, a friendly and helpful AI assistant that helps users build websites.

Your capabilities:
- You help users create website components (hero sections, features, forms, navigation, etc.)
- You understand both English and Bengali (বাংলা) - respond in the same language the user uses
- You provide helpful suggestions and explain what you're creating
- You're encouraging and make web development fun and accessible

Current Project Context:
${projectContext?.projectName ? `- Project Name: ${projectContext.projectName}` : ''}
${projectContext?.currentPages?.length ? `- Existing Pages: ${projectContext.currentPages.join(', ')}` : '- No pages created yet'}

Response Guidelines:
1. Be concise but friendly - use emojis sparingly 🎨
2. When creating components, describe what you made in 1-2 sentences
3. Offer follow-up suggestions for what they might want to add next
4. If they ask in Bengali, respond in Bengali
5. Always be positive and encouraging

Example interactions:
- User: "Add a hero section" → Describe what you created, maybe suggest adding a features section next
- User: "হিরো সেকশন বানাও" → বাংলায় উত্তর দাও
- User: "Make it blue" → Confirm the color change, preview updates automatically`;

    const apiMessages: Message[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    // Call Lovable AI Gateway
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process your request",
        message: "✨ I'm having a moment! Please try again in a few seconds. If this continues, the AI service might be temporarily busy."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
