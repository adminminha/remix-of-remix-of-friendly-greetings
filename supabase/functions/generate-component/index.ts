// Tota AI - Complete Website Generation Edge Function
// Generates complete websites with multiple components using AI

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ComponentSpec {
  name: string;
  purpose: string;
  dependencies: string[];
}

interface GenerationPlan {
  type: 'conversation' | 'component' | 'website';
  mainComponent?: string;
  subComponents?: ComponentSpec[];
  response?: string;
}

const AVAILABLE_UI_COMPONENTS = `
## Available UI Components (import from @/components/ui/)

### Core Components
- Button: <Button variant="default|destructive|outline|secondary|ghost|link" size="default|sm|lg|icon">Text</Button>
- Input: <Input type="text|email|password|number" placeholder="..." />
- Textarea: <Textarea placeholder="..." rows={4} />
- Label: <Label htmlFor="id">Label text</Label>

### Card Components
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

### Display Components  
- Badge: <Badge variant="default|secondary|destructive|outline">Text</Badge>
- Avatar, AvatarImage, AvatarFallback
- Progress: <Progress value={50} />
- Separator: <Separator orientation="horizontal|vertical" />

### Form Components
- Checkbox, Switch, Select, SelectTrigger, SelectValue, SelectContent, SelectItem

### Layout Components
- Tabs, TabsList, TabsTrigger, TabsContent
- Accordion, AccordionItem, AccordionTrigger, AccordionContent
- ScrollArea

### Feedback Components
- Alert, AlertTitle, AlertDescription

## Available Icons (import from lucide-react)
ArrowRight, ArrowLeft, Check, X, Plus, Minus, Search, Settings, User, Mail, Phone, MapPin, Calendar, Clock, Star, Heart, Home, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, Download, Upload, Edit, Trash, Copy, Share, Send, Save, Loader2, Sparkles, Zap, Rocket, Code, Palette, Layout, Image, Video, Music, File, Folder, Globe, Link, Lock, Eye, Bell, MessageSquare, Info, AlertCircle, CheckCircle, ShoppingCart, ShoppingBag, Package, Truck, CreditCard, DollarSign, TrendingUp, BarChart, Activity, Target, Award, Gift, Users, Briefcase, Facebook, Twitter, Instagram, Linkedin, Github
`;

const SYSTEM_PROMPT = `You are Tota AI, a powerful React website/component generator that creates beautiful, functional UI.

## CRITICAL: Message Type Detection
FIRST, analyze the user's message to determine the appropriate response type:

### Type 1: GREETING/CONVERSATION
If the message is:
- A greeting: "hi", "hello", "hey", "কেমন আছো", "কি খবর", "assalamu alaikum"
- A question about you: "who are you", "তুমি কে", "what can you do"
- General chat: "thanks", "ধন্যবাদ", "good", "nice"

Return:
{
  "type": "conversation",
  "response": "Your friendly response in user's language"
}

### Type 2: WEBSITE/LANDING PAGE GENERATION
If the message asks for "website", "landing page", "full page", "portfolio", "e-commerce":

Return a plan with multiple components:
{
  "type": "website",
  "mainComponent": "EcommerceLandingPage",
  "subComponents": [
    {"name": "Header", "purpose": "Navigation with logo, links, cart", "dependencies": ["Button", "Badge"]},
    {"name": "Hero", "purpose": "Hero banner with headline and CTA", "dependencies": ["Button"]},
    {"name": "Products", "purpose": "Product grid with cards", "dependencies": ["Card", "CardContent", "Badge", "Button"]},
    {"name": "Features", "purpose": "Features/benefits section", "dependencies": []},
    {"name": "Newsletter", "purpose": "Email signup section", "dependencies": ["Input", "Button"]},
    {"name": "Footer", "purpose": "Footer with links and social", "dependencies": ["Separator"]}
  ]
}

### Type 3: SINGLE COMPONENT
If the message asks for a specific component (button, form, card, section):

{
  "type": "component",
  "mainComponent": "ContactForm",
  "subComponents": []
}

${AVAILABLE_UI_COMPONENTS}

IMPORTANT: Return ONLY valid JSON. No markdown, no code blocks.`;

const COMPONENT_GENERATION_PROMPT = `Generate a complete, beautiful React/TypeScript component.

RULES:
1. Import from '@/components/ui/[name]' for UI components
2. Import icons from 'lucide-react'
3. Use Tailwind CSS for ALL styling
4. Make it visually stunning with gradients, shadows, animations
5. Mobile responsive using sm:, md:, lg: breakpoints
6. Use placeholder images: https://placehold.co/400x400?text=Product

Return ONLY the complete React component code.
Start with: import React from 'react';
End with: export default ComponentName;`;

// Preview HTML builder with all UI components
const buildPreviewHtml = (componentCode: string, componentName: string): string => {
  const strippedCode = componentCode
    .replace(/import\s+.*?from\s+['"][^'"]+['"];?\n?/g, '')
    .replace(/export\s+default\s+/g, '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo, useRef } = React;
    const Icons = window.lucideReact || {};
    
    // Icon components
    const ArrowRight = (props) => React.createElement(Icons.ArrowRight || 'span', props);
    const Star = (props) => React.createElement(Icons.Star || 'span', props);
    const ShoppingCart = (props) => React.createElement(Icons.ShoppingCart || 'span', props);
    const Search = (props) => React.createElement(Icons.Search || 'span', props);
    const Menu = (props) => React.createElement(Icons.Menu || 'span', props);
    const Heart = (props) => React.createElement(Icons.Heart || 'span', props);
    const Truck = (props) => React.createElement(Icons.Truck || 'span', props);
    const ShieldCheck = (props) => React.createElement(Icons.ShieldCheck || 'span', props);
    const RotateCcw = (props) => React.createElement(Icons.RotateCcw || 'span', props);
    const Facebook = (props) => React.createElement(Icons.Facebook || 'span', props);
    const Twitter = (props) => React.createElement(Icons.Twitter || 'span', props);
    const Instagram = (props) => React.createElement(Icons.Instagram || 'span', props);
    const Mail = (props) => React.createElement(Icons.Mail || 'span', props);
    const Phone = (props) => React.createElement(Icons.Phone || 'span', props);
    const MapPin = (props) => React.createElement(Icons.MapPin || 'span', props);
    const ChevronDown = (props) => React.createElement(Icons.ChevronDown || 'span', props);
    const ChevronRight = (props) => React.createElement(Icons.ChevronRight || 'span', props);
    const Check = (props) => React.createElement(Icons.Check || 'span', props);
    const Sparkles = (props) => React.createElement(Icons.Sparkles || 'span', props);
    const Zap = (props) => React.createElement(Icons.Zap || 'span', props);
    const Users = (props) => React.createElement(Icons.Users || 'span', props);
    const Award = (props) => React.createElement(Icons.Award || 'span', props);
    
    // UI Components
    const cn = (...classes) => classes.filter(Boolean).join(' ');
    
    const Button = React.forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
      const variants = {
        default: "bg-purple-600 text-white hover:bg-purple-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "hover:bg-gray-100 text-gray-900",
        link: "text-purple-600 underline-offset-4 hover:underline"
      };
      const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-lg",
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
    
    const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => (
      React.createElement("input", {
        ref,
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500",
          className
        ),
        ...props
      })
    ));
    
    const Card = ({ className, children, ...props }) => (
      React.createElement("div", {
        className: cn("rounded-lg border bg-white shadow-sm", className),
        ...props
      }, children)
    );
    
    const CardHeader = ({ className, children, ...props }) => (
      React.createElement("div", {
        className: cn("flex flex-col space-y-1.5 p-6", className),
        ...props
      }, children)
    );
    
    const CardTitle = ({ className, children, ...props }) => (
      React.createElement("h3", {
        className: cn("text-2xl font-semibold leading-none tracking-tight", className),
        ...props
      }, children)
    );
    
    const CardContent = ({ className, children, ...props }) => (
      React.createElement("div", {
        className: cn("p-6 pt-0", className),
        ...props
      }, children)
    );
    
    const CardFooter = ({ className, children, ...props }) => (
      React.createElement("div", {
        className: cn("flex items-center p-6 pt-0", className),
        ...props
      }, children)
    );
    
    const Badge = ({ className, variant = "default", children, ...props }) => {
      const variants = {
        default: "bg-purple-600 text-white",
        secondary: "bg-gray-200 text-gray-900",
        destructive: "bg-red-600 text-white",
        outline: "border border-gray-300 text-gray-900"
      };
      return React.createElement("div", {
        className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className),
        ...props
      }, children);
    };
    
    const Separator = ({ className, orientation = "horizontal", ...props }) => (
      React.createElement("div", {
        className: cn(
          "shrink-0 bg-gray-200",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        ),
        ...props
      })
    );
    
    // Generated Component
    ${strippedCode}
    
    // Render
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${componentName}));
  </script>
</body>
</html>`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { prompt, projectId } = await req.json();
    
    console.log("=== GENERATION REQUEST ===");
    console.log("Prompt:", prompt);
    console.log("Project ID:", projectId);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // STEP 1: Analyze request and create plan
    console.log("Step 1: Analyzing request...");
    
    const analysisResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      const errText = await analysisResponse.text();
      console.error("Analysis API error:", errText);
      throw new Error("AI analysis failed");
    }

    const analysisData = await analysisResponse.json();
    const analysisText = analysisData.choices?.[0]?.message?.content || "";
    console.log("Analysis response:", analysisText);

    // Parse the plan
    let plan: GenerationPlan;
    try {
      const cleaned = analysisText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // Find JSON object
      const jsonStart = cleaned.indexOf('{');
      const jsonEnd = cleaned.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON found");
      }
      
      plan = JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
    } catch (e) {
      console.error("Failed to parse analysis:", e);
      // Fallback to single component
      plan = {
        type: 'component',
        mainComponent: 'GeneratedComponent',
        subComponents: []
      };
    }

    console.log("Generation plan:", plan);

    // Handle conversation
    if (plan.type === 'conversation') {
      return new Response(
        JSON.stringify({
          success: true,
          type: 'conversation',
          response: plan.response || "হ্যালো! আমি Tota AI। আপনি কি ধরনের website তৈরি করতে চান? 🚀"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // STEP 2: Generate all components
    console.log("Step 2: Generating components...");
    
    const generatedComponents: Array<{ name: string; path: string; code: string }> = [];
    const subComponents = plan.subComponents || [];

    // Generate sub-components for website type
    if (plan.type === 'website' && subComponents.length > 0) {
      for (const spec of subComponents) {
        console.log(`Generating ${spec.name}...`);
        
        const compPrompt = `${COMPONENT_GENERATION_PROMPT}

Component: ${spec.name}
Purpose: ${spec.purpose}
UI Components to use: ${spec.dependencies.join(', ') || 'None specific'}

Create a beautiful, production-ready ${spec.name} component.`;

        const compResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "user", content: compPrompt }],
            max_tokens: 3000,
          }),
        });

        if (!compResponse.ok) {
          console.error(`Failed to generate ${spec.name}`);
          continue;
        }

        const compData = await compResponse.json();
        let code = compData.choices?.[0]?.message?.content || "";
        
        // Clean code
        code = code
          .replace(/```typescript\n?/g, '')
          .replace(/```tsx\n?/g, '')
          .replace(/```jsx\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();

        generatedComponents.push({
          name: spec.name,
          path: `src/components/${spec.name}.tsx`,
          code
        });
      }
    }

    // STEP 3: Generate main component
    console.log("Step 3: Generating main component...");
    
    const mainComponentName = plan.mainComponent || 'GeneratedComponent';
    
    let mainPrompt: string;
    if (plan.type === 'website' && subComponents.length > 0) {
      mainPrompt = `${COMPONENT_GENERATION_PROMPT}

Create the main ${mainComponentName} component that combines ALL these sections into a complete, beautiful website:

${subComponents.map(s => `- ${s.name}: ${s.purpose}`).join('\n')}

Original request: "${prompt}"

IMPORTANT:
1. Import ALL sub-components: ${subComponents.map(s => `import ${s.name} from '@/components/${s.name}';`).join('\n')}
2. Arrange them in a logical order (Header at top, Footer at bottom)
3. Create a cohesive, professional design
4. Add smooth scroll and transitions
5. Make it production-ready

The main component should render all sub-components in order.`;
    } else {
      mainPrompt = `${COMPONENT_GENERATION_PROMPT}

Create: ${prompt}

Make it beautiful, functional, and production-ready.
Use Tailwind CSS for styling with gradients, shadows, and animations.
Component name: ${mainComponentName}`;
    }

    const mainResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: mainPrompt }],
        max_tokens: 4000,
      }),
    });

    if (!mainResponse.ok) {
      throw new Error("Failed to generate main component");
    }

    const mainData = await mainResponse.json();
    let mainCode = mainData.choices?.[0]?.message?.content || "";
    
    // Clean code
    mainCode = mainCode
      .replace(/```typescript\n?/g, '')
      .replace(/```tsx\n?/g, '')
      .replace(/```jsx\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    generatedComponents.push({
      name: mainComponentName,
      path: `src/components/${mainComponentName}.tsx`,
      code: mainCode
    });

    // STEP 4: Generate Home.tsx update
    const homeCode = `import React from 'react';
import ${mainComponentName} from '@/components/${mainComponentName}';

export default function Home() {
  return <${mainComponentName} />;
}`;

    // STEP 5: Build preview HTML
    const previewHtml = buildPreviewHtml(mainCode, mainComponentName);

    // Response
    const response = {
      success: true,
      type: plan.type,
      component: {
        code: mainCode,
        componentName: mainComponentName,
        filePath: `src/components/${mainComponentName}.tsx`,
        previewHtml
      },
      components: generatedComponents,
      homeUpdate: {
        path: "src/pages/Home.tsx",
        code: homeCode
      },
      description: `✅ Created ${mainComponentName} with ${subComponents.length} sub-components: ${subComponents.map(s => s.name).join(', ')}`,
      message: `Generated complete ${plan.type === 'website' ? 'website' : 'component'} with ${generatedComponents.length} components!`
    };

    console.log("=== GENERATION COMPLETE ===");
    console.log(`Total components: ${generatedComponents.length}`);

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in generate-component:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Generation failed",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
