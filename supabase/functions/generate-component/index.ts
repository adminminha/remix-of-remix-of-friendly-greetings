// Tota AI - Component Generation Edge Function
// Generates React/JSX code using AI based on user prompts

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface GenerateRequest {
  prompt: string;
  projectId: string;
  currentPage?: string;
  existingComponents?: string[];
}

interface GeneratedComponent {
  code: string;
  componentName: string;
  filePath: string;
  previewHtml: string;
}

// Pre-structured template components available for AI to use
const AVAILABLE_COMPONENTS = `
Available UI Components (import from @/components/ui/):
- Button: <Button variant="default|destructive|outline|secondary|ghost|link" size="default|sm|lg|icon">Text</Button>
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Input: <Input type="text|email|password" placeholder="..." />
- Textarea: <Textarea placeholder="..." />
- Label: <Label htmlFor="id">Label text</Label>
- Badge: <Badge variant="default|secondary|destructive|outline">Text</Badge>
- Avatar, AvatarImage, AvatarFallback
- Checkbox: <Checkbox id="id" />
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Tabs, TabsList, TabsTrigger, TabsContent
- Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription
- Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle
- ScrollArea: <ScrollArea className="h-[200px]">content</ScrollArea>
- Separator: <Separator orientation="horizontal|vertical" />
- Progress: <Progress value={50} />
- Slider: <Slider defaultValue={[50]} max={100} step={1} />
- Switch: <Switch checked={true} onCheckedChange={() => {}} />
- Toggle: <Toggle pressed={true} onPressedChange={() => {}}>content</Toggle>
- Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
- Accordion, AccordionItem, AccordionTrigger, AccordionContent
- Alert, AlertTitle, AlertDescription
- Table, TableHeader, TableBody, TableRow, TableHead, TableCell

Icons (import from lucide-react):
- Common: ArrowRight, ArrowLeft, Check, X, Plus, Minus, Search, Settings, User, Mail, Phone, MapPin, Calendar, Clock, Star, Heart, Home, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, Download, Upload, Edit, Trash, Copy, Share, Send, Save, Loader2, Sparkles, Zap, Rocket, Code, Palette, Layout, Image, Video, Music, File, Folder, Globe, Link, Lock, Unlock, Eye, EyeOff, Bell, MessageSquare, Info, AlertCircle, CheckCircle, XCircle
`;

const SYSTEM_PROMPT = `You are Tota AI, a React component generator. Your job is to generate React/JSX components based on user requests.

CRITICAL RULES:
1. ONLY use the provided UI components from the template - never invent new ones
2. Use Tailwind CSS for all styling
3. Generate clean, readable React functional components
4. Use TypeScript types when appropriate
5. Keep components self-contained and reusable
6. Support both English and Bengali (বাংলা) prompts

${AVAILABLE_COMPONENTS}

RESPONSE FORMAT:
You must respond with ONLY a valid JSON object (no markdown, no code blocks, no explanations):
{
  "componentName": "ComponentName",
  "code": "full React component code as a single string",
  "description": "Brief description of what was created"
}

CODE GUIDELINES:
1. Import React and necessary components at the top
2. Use 'export default' for the main component
3. Use semantic HTML (section, header, main, footer, article, nav)
4. Make designs visually appealing with proper spacing, colors
5. Use placeholder images: https://placehold.co/800x400 (adjust size as needed)
6. For icons, use lucide-react (import { IconName } from 'lucide-react')

EXAMPLE OUTPUT for "Create a hero section":
{
  "componentName": "HeroSection",
  "code": "import React from 'react';\\nimport { Button } from '@/components/ui/button';\\nimport { ArrowRight } from 'lucide-react';\\n\\nconst HeroSection = () => {\\n  return (\\n    <section className=\\"bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20\\">\\n      <div className=\\"container mx-auto px-4 text-center\\">\\n        <h1 className=\\"text-4xl md:text-6xl font-bold mb-6\\">Welcome to My Site</h1>\\n        <p className=\\"text-xl mb-8 text-white/80\\">Build amazing things with ease</p>\\n        <Button size=\\"lg\\" className=\\"bg-white text-purple-600 hover:bg-gray-100\\">\\n          Get Started <ArrowRight className=\\"ml-2 h-5 w-5\\" />\\n        </Button>\\n      </div>\\n    </section>\\n  );\\n};\\n\\nexport default HeroSection;",
  "description": "A hero section with gradient background, heading, subtext, and CTA button"
}`;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, projectId, currentPage, existingComponents } = (await req.json()) as GenerateRequest;

    if (!prompt || !projectId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: prompt and projectId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build context message
    let contextMessage = `User Request: "${prompt}"`;
    if (currentPage) {
      contextMessage += `\nCurrent Page: ${currentPage}`;
    }
    if (existingComponents && existingComponents.length > 0) {
      contextMessage += `\nExisting Components in project: ${existingComponents.join(", ")}`;
    }

    console.log("Generating component for prompt:", prompt);

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: contextMessage }
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a few seconds." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No content received from AI");
    }

    console.log("AI Response:", aiContent.substring(0, 200));

    // Parse AI response (it should be JSON)
    let parsedResponse;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: create a simple component
      parsedResponse = {
        componentName: "GeneratedComponent",
        code: `import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="p-8 text-center">
      <p className="text-lg text-gray-600">Component generation in progress...</p>
      <p className="text-sm text-gray-400 mt-2">Request: ${prompt}</p>
    </div>
  );
};

export default GeneratedComponent;`,
        description: "Placeholder component - AI response parsing failed"
      };
    }

    const { componentName, code, description } = parsedResponse;

    // Generate preview HTML that can be rendered in an iframe
    const previewHtml = generatePreviewHtml(code, componentName);

    const result: GeneratedComponent = {
      code,
      componentName,
      filePath: `src/components/${componentName}.tsx`,
      previewHtml,
    };

    console.log("Generated component:", componentName);

    return new Response(
      JSON.stringify({
        success: true,
        component: result,
        description,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-component:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate component",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Generate standalone HTML for iframe preview
function generatePreviewHtml(componentCode: string, componentName: string): string {
  // Extract the JSX return content from the component code
  const returnMatch = componentCode.match(/return\s*\(\s*([\s\S]*?)\s*\);?\s*\}[\s\S]*?(?:export|$)/);
  const jsxContent = returnMatch ? returnMatch[1] : '<div>Preview not available</div>';
  
  // Convert JSX to HTML-like syntax for preview (simplified conversion)
  let htmlContent = jsxContent
    // Replace className with class
    .replace(/className=/g, 'class=')
    // Remove JSX expressions for static preview (simplified)
    .replace(/\{[^}]+\}/g, '')
    // Convert self-closing tags
    .replace(/<(\w+)([^>]*?)\/>/g, '<$1$2></$1>')
    // Remove React/component imports
    .replace(/<(Button|Card|Badge|Input|Avatar)[^>]*>([^<]*)<\/\1>/gi, (match, tag, content) => {
      if (tag.toLowerCase() === 'button') {
        return `<button class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-purple-600 text-white px-4 py-2 hover:bg-purple-700">${content}</button>`;
      }
      return `<div class="p-4 border rounded-lg">${content}</div>`;
    });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName} Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}
