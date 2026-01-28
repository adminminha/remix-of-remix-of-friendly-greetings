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

    // Generate live React preview HTML
    const previewHtml = generateLivePreviewHtml(code, componentName);

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

// Pre-bundled UI component definitions for iframe preview
const UI_COMPONENTS_SCRIPT = `
const cn = (...classes) => classes.filter(Boolean).join(' ');

const Button = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "hover:bg-gray-100",
    link: "text-purple-600 underline-offset-4 hover:underline"
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };
  return React.createElement("button", {
    ref,
    className: cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50",
      variants[variant],
      sizes[size],
      className
    ),
    ...props
  }, children);
});

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn("rounded-lg border bg-white shadow-sm", className),
    ...props
  }, children)
));

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }, children)
));

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("h3", {
    ref,
    className: cn("text-2xl font-semibold leading-none tracking-tight", className),
    ...props
  }, children)
));

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("p", {
    ref,
    className: cn("text-sm text-gray-500", className),
    ...props
  }, children)
));

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn("p-6 pt-0", className),
    ...props
  }, children)
));

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }, children)
));

const Badge = ({ className, variant = "default", children, ...props }) => {
  const variants = {
    default: "bg-purple-600 text-white",
    secondary: "bg-gray-200 text-gray-900",
    destructive: "bg-red-600 text-white",
    outline: "border border-gray-300 text-gray-900"
  };
  return React.createElement("div", {
    className: cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      variants[variant],
      className
    ),
    ...props
  }, children);
};

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
  React.createElement("input", {
    ref,
    type,
    className: cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50",
      className
    ),
    ...props
  })
));

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  React.createElement("textarea", {
    ref,
    className: cn(
      "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50",
      className
    ),
    ...props
  })
));

const Label = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("label", {
    ref,
    className: cn("text-sm font-medium leading-none", className),
    ...props
  }, children)
));

const Avatar = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("span", {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }, children)
));

const AvatarImage = React.forwardRef(({ className, src, alt, ...props }, ref) => (
  React.createElement("img", {
    ref,
    src,
    alt,
    className: cn("aspect-square h-full w-full", className),
    ...props
  })
));

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("span", {
    ref,
    className: cn("flex h-full w-full items-center justify-center rounded-full bg-gray-200", className),
    ...props
  }, children)
));

const Separator = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn(
      "shrink-0 bg-gray-200",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  })
));

const Progress = React.forwardRef(({ className, value = 0, ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-200", className),
    ...props
  }, React.createElement("div", {
    className: "h-full bg-purple-600 transition-all",
    style: { width: value + "%" }
  }))
));

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn("relative overflow-auto", className),
    ...props
  }, children)
));

const Skeleton = ({ className, ...props }) => (
  React.createElement("div", {
    className: cn("animate-pulse rounded-md bg-gray-200", className),
    ...props
  })
);

window.UI = {
  Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge, Input, Textarea, Label, Avatar, AvatarImage, AvatarFallback,
  Separator, Progress, ScrollArea, Skeleton, cn
};
`;

// Lucide icons as simple SVG components
const LUCIDE_ICONS_SCRIPT = `
const createIcon = (paths) => (props) => 
  React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: props.size || 24,
    height: props.size || 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: props.className,
    ...props
  }, ...paths.map((d, i) => React.createElement("path", { key: i, d })));

const Icons = {
  ArrowRight: createIcon(["M5 12h14", "m12 5 7 7-7 7"]),
  ArrowLeft: createIcon(["m12 19-7-7 7-7", "M19 12H5"]),
  Check: createIcon(["M20 6 9 17l-5-5"]),
  X: createIcon(["M18 6 6 18", "m6 6 12 12"]),
  Plus: createIcon(["M5 12h14", "M12 5v14"]),
  Search: createIcon(["M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "m21 21-4.3-4.3"]),
  User: createIcon(["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"]),
  Mail: createIcon(["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z", "m22 6-10 7L2 6"]),
  Phone: createIcon(["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"]),
  Star: createIcon(["m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"]),
  Heart: createIcon(["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"]),
  Home: createIcon(["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]),
  Menu: createIcon(["M4 12h16", "M4 6h16", "M4 18h16"]),
  ChevronDown: createIcon(["m6 9 6 6 6-6"]),
  ChevronRight: createIcon(["m9 18 6-6-6-6"]),
  ExternalLink: createIcon(["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", "m15 3 6 6", "M10 14 21 3"]),
  Download: createIcon(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m7 10 5 5 5-5", "M12 15V3"]),
  Edit: createIcon(["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]),
  Trash: createIcon(["M3 6h18", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"]),
  Send: createIcon(["m22 2-7 20-4-9-9-4Z", "M22 2 11 13"]),
  Sparkles: createIcon(["m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"]),
  Zap: createIcon(["M13 2 3 14h9l-1 8 10-12h-9l1-8z"]),
  Rocket: createIcon(["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z", "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"]),
  Globe: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"]),
  Eye: createIcon(["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]),
  Bell: createIcon(["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"]),
  MessageSquare: createIcon(["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]),
  Info: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 16v-4", "M12 8h.01"]),
  CheckCircle: createIcon(["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"])
};

window.Icons = Icons;
Object.assign(window, Icons);
`;

// Generate live React preview HTML with CDN-based runtime
function generateLivePreviewHtml(componentCode: string, componentName: string): string {
  // Clean the component code for embedding
  const cleanedCode = componentCode
    .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')
    .replace(/\b(Button|Card|CardHeader|CardTitle|CardDescription|CardContent|CardFooter|Badge|Input|Textarea|Label|Avatar|AvatarImage|AvatarFallback|Separator|Progress|ScrollArea|Skeleton)\b(?=\s*[<(])/g, 'UI.$1')
    .replace(/export\s+default\s+/g, 'const ExportedComponent = ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName} Preview - Tota AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .preview-error { padding: 20px; background: #fef2f2; color: #dc2626; border-radius: 8px; margin: 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes pulse { 50% { opacity: .5; } }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: { DEFAULT: '#6366f1', foreground: '#ffffff' },
            secondary: { DEFAULT: '#f4f4f5', foreground: '#18181b' },
            muted: { DEFAULT: '#f4f4f5', foreground: '#71717a' },
            accent: { DEFAULT: '#f4f4f5', foreground: '#18181b' },
            destructive: { DEFAULT: '#ef4444', foreground: '#ffffff' },
          }
        }
      }
    }
  </script>
</head>
<body>
  <div id="root"></div>
  
  <script>${UI_COMPONENTS_SCRIPT}</script>
  <script>${LUCIDE_ICONS_SCRIPT}</script>
  
  <script type="text/babel">
    try {
      ${cleanedCode}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(ExportedComponent || ${componentName}));
    } catch (error) {
      console.error('Preview Error:', error);
      document.getElementById('root').innerHTML = '<div class="preview-error"><strong>Preview Error:</strong><br/>' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
}
