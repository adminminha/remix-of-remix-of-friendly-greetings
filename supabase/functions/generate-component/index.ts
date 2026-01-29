// Tota AI - Component Generation Edge Function
// Generates React/JSX code using AI based on user prompts
// Uses template-aware system prompt for consistent component generation

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
  requestType?: 'component' | 'layout' | 'page' | 'feature';
}

interface GeneratedComponent {
  code: string;
  componentName: string;
  filePath: string;
  previewHtml: string;
}

// Complete list of available UI components with usage details
const AVAILABLE_UI_COMPONENTS = `
## Available UI Components (import from @/components/ui/)

### Core Components
- Button: <Button variant="default|destructive|outline|secondary|ghost|link" size="default|sm|lg|icon">Text</Button>
- Input: <Input type="text|email|password|number" placeholder="..." />
- Textarea: <Textarea placeholder="..." rows={4} />
- Label: <Label htmlFor="id">Label text</Label>

### Card Components
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
  Example:
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardHeader>
    <CardContent>Content here</CardContent>
    <CardFooter>Footer actions</CardFooter>
  </Card>

### Display Components
- Badge: <Badge variant="default|secondary|destructive|outline">Text</Badge>
- Avatar, AvatarImage, AvatarFallback
  <Avatar><AvatarImage src="..." /><AvatarFallback>AB</AvatarFallback></Avatar>
- Progress: <Progress value={50} />
- Skeleton: <Skeleton className="h-4 w-[200px]" />
- Separator: <Separator orientation="horizontal|vertical" />

### Form Components
- Checkbox: <Checkbox id="terms" checked={checked} onCheckedChange={setChecked} />
- Switch: <Switch checked={enabled} onCheckedChange={setEnabled} />
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
  <Select value={value} onValueChange={setValue}>
    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
    <SelectContent>
      <SelectItem value="1">Option 1</SelectItem>
    </SelectContent>
  </Select>

### Table Components
- Table, TableHeader, TableBody, TableRow, TableHead, TableCell
  <Table>
    <TableHeader>
      <TableRow><TableHead>Column</TableHead></TableRow>
    </TableHeader>
    <TableBody>
      <TableRow><TableCell>Data</TableCell></TableRow>
    </TableBody>
  </Table>

### Navigation & Layout
- Tabs, TabsList, TabsTrigger, TabsContent
  <Tabs defaultValue="tab1">
    <TabsList>
      <TabsTrigger value="tab1">Tab 1</TabsTrigger>
      <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Content 1</TabsContent>
    <TabsContent value="tab2">Content 2</TabsContent>
  </Tabs>
- Accordion, AccordionItem, AccordionTrigger, AccordionContent
- ScrollArea: <ScrollArea className="h-[200px]">content</ScrollArea>

### Feedback Components
- Alert, AlertTitle, AlertDescription
  <Alert variant="default|destructive">
    <AlertTitle>Title</AlertTitle>
    <AlertDescription>Description</AlertDescription>
  </Alert>

### Interactive Components
- Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription
- Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle
- Tooltip, TooltipTrigger, TooltipContent, TooltipProvider

## Available Icons (import from lucide-react)
ArrowRight, ArrowLeft, Check, X, Plus, Minus, Search, Settings, User, Mail, Phone, MapPin, Calendar, Clock, Star, Heart, Home, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, Download, Upload, Edit, Trash, Copy, Share, Send, Save, Loader2, Sparkles, Zap, Rocket, Code, Palette, Layout, Image, Video, Music, File, Folder, Globe, Link, Lock, Unlock, Eye, EyeOff, Bell, MessageSquare, Info, AlertCircle, CheckCircle, XCircle, MoreHorizontal, MoreVertical, RefreshCw, Filter, SortAsc, SortDesc, Grid, List, Play, Pause, Volume2, VolumeX, Wifi, Battery, Sun, Moon, Cloud, Umbrella, Thermometer, Wind, Droplet, Flame, Leaf, Tree, Mountain, Building, Car, Plane, Ship, Train, Bike, Walk, CreditCard, DollarSign, Euro, Percent, TrendingUp, TrendingDown, BarChart, PieChart, Activity, Target, Award, Gift, ShoppingCart, ShoppingBag, Package, Truck, MapPinned, Navigation, Compass, Flag, Bookmark, Tag, Tags, Hash, AtSign, Paperclip, Link2, Unlink, Scissors, Clipboard, ClipboardCheck, ClipboardList, FileText, FileCode, FilePlus, FileMinus, FolderOpen, FolderPlus, Archive, Inbox, Outbox, Forward, Reply, ReplyAll, CornerUpLeft, CornerUpRight, CornerDownLeft, CornerDownRight, ArrowUp, ArrowDown, Move, Maximize, Minimize, Expand, Shrink, ZoomIn, ZoomOut, RotateCw, RotateCcw, Repeat, Shuffle, SkipBack, SkipForward, Rewind, FastForward, Mic, MicOff, Camera, CameraOff, Film, Tv, Radio, Headphones, Speaker, Monitor, Smartphone, Tablet, Laptop, Server, Database, HardDrive, Cpu, Wifi, Bluetooth, Cast, Airplay, Power, PowerOff, LogIn, LogOut, Key, Shield, ShieldCheck, UserPlus, UserMinus, UserCheck, UserX, Users, Group, Briefcase, Lightbulb
`;

// System prompt for AI code generation
const SYSTEM_PROMPT = `You are Tota AI, a powerful React component generator and friendly AI assistant that creates beautiful, functional UI components.

## CRITICAL: Message Type Detection
FIRST, analyze the user's message to determine the appropriate response type:

### Type 1: GREETING/CONVERSATION (respond conversationally)
If the message is:
- A greeting: "hi", "hello", "hey", "কেমন আছো", "কি খবর", "স্বাগতম", "assalamu alaikum"
- A question about you: "who are you", "তুমি কে", "what can you do"
- General chat: "thanks", "ধন্যবাদ", "good", "nice"
- Help request without specific build task: "help me", "সাহায্য করো"

Return this JSON format:
{
  "type": "conversation",
  "response": "Your friendly response in the user's language (Bengali or English)"
}

Example for "Hi কেমন আছো":
{
  "type": "conversation", 
  "response": "হ্যালো! আমি ভালো আছি, ধন্যবাদ! 😊 আমি Tota AI - আপনার website তৈরি করতে সাহায্য করি। কি ধরনের website বা component তৈরি করতে চান?"
}

### Type 2: COMPONENT/WEBSITE GENERATION (generate code)
If the message explicitly asks to CREATE, BUILD, MAKE, or DESIGN something:
- "create a hero section", "make a navbar", "build a landing page"
- "একটা contact form বানাও", "pricing section তৈরি করো"
- "e-commerce website", "portfolio site", "blog design"

Then generate the component as specified below.

## Your Capabilities:
1. Generate complete React components with TypeScript
2. Create responsive designs using Tailwind CSS
3. Build functional features with React hooks (useState, useEffect, etc.)
4. Support both English and Bengali (বাংলা) prompts

## CRITICAL RULES:
1. ONLY use components from the provided UI library - never create custom base components
2. Use Tailwind CSS for ALL styling - no inline styles or CSS files
3. Generate self-contained components with mock data when needed
4. Make designs visually appealing with proper spacing, colors, and shadows
5. Include TypeScript types when defining data structures
6. Use placeholder images: https://placehold.co/800x400 (adjust dimensions as needed)
7. For icons, ONLY use lucide-react icons listed below

${AVAILABLE_UI_COMPONENTS}

## Response Format for COMPONENT GENERATION:
Return ONLY a valid JSON object (no markdown, no code blocks, no backticks):
{
  "type": "component",
  "componentName": "ComponentName",
  "code": "complete React component code as a string",
  "description": "Brief description of what was created in the user's language"
}

## FULL WEBSITE/LANDING PAGE Generation:
When user asks for "website", "landing page", "full page", or "পুরো website":
- Generate a COMPLETE page with multiple sections in ONE component
- Include: Hero, Features, About, Testimonials/Reviews, CTA, Footer
- Make it fully responsive and production-ready
- Use semantic HTML structure
- Component should be named like "LandingPage", "HomePage", "WebsitePage"

## Code Guidelines:
1. Start with: import React from 'react';
2. Import UI components like: import { Button } from '@/components/ui/button';
3. Import icons like: import { ArrowRight, Star } from 'lucide-react';
4. Use 'export default' for the main component
5. Use semantic HTML (section, header, main, footer, article, nav)
6. Make all designs mobile-responsive using Tailwind breakpoints (sm:, md:, lg:)
7. Add hover states and transitions for interactive elements
8. Use modern design patterns: gradients, shadows, rounded corners
9. Include functional state management when the component needs interactivity

## Design Principles:
- Clean, modern aesthetics
- Consistent spacing (p-4, p-6, p-8, gap-4, gap-6)
- Professional color palette using Tailwind colors
- Smooth transitions (transition-all, duration-300)
- Hover effects for interactivity
- Proper contrast for readability
- Card-based layouts for content grouping

## Example Response for "Create a hero section":
{"type":"component","componentName":"HeroSection","code":"import React from 'react';\\nimport { Button } from '@/components/ui/button';\\nimport { ArrowRight, Sparkles } from 'lucide-react';\\n\\nconst HeroSection = () => {\\n  return (\\n    <section className=\\"relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white py-20 lg:py-32 overflow-hidden\\">\\n      <div className=\\"absolute inset-0 bg-[url('/grid.svg')] opacity-10\\"></div>\\n      <div className=\\"container mx-auto px-4 relative z-10\\">\\n        <div className=\\"max-w-3xl mx-auto text-center\\">\\n          <div className=\\"inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6\\">\\n            <Sparkles className=\\"h-4 w-4\\" />\\n            <span className=\\"text-sm font-medium\\">Welcome to the future</span>\\n          </div>\\n          <h1 className=\\"text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight\\">\\n            Build Amazing Products\\n            <span className=\\"block text-yellow-300\\">With AI Power</span>\\n          </h1>\\n          <p className=\\"text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto\\">\\n            Transform your ideas into reality with our cutting-edge platform. Start building today.\\n          </p>\\n          <div className=\\"flex flex-col sm:flex-row gap-4 justify-center\\">\\n            <Button size=\\"lg\\" className=\\"bg-white text-purple-600 hover:bg-gray-100 font-semibold\\">\\n              Get Started Free\\n              <ArrowRight className=\\"ml-2 h-5 w-5\\" />\\n            </Button>\\n            <Button size=\\"lg\\" variant=\\"outline\\" className=\\"border-white text-white hover:bg-white/10\\">\\n              Watch Demo\\n            </Button>\\n          </div>\\n        </div>\\n      </div>\\n    </section>\\n  );\\n};\\n\\nexport default HeroSection;","description":"Created a stunning hero section with gradient background, animated badge, bold typography, and dual CTA buttons"}`;

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

const Table = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("div", { className: "relative w-full overflow-auto" },
    React.createElement("table", {
      ref,
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }, children)
  )
));

const TableHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("thead", {
    ref,
    className: cn("[&_tr]:border-b", className),
    ...props
  }, children)
));

const TableBody = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("tbody", {
    ref,
    className: cn("[&_tr:last-child]:border-0", className),
    ...props
  }, children)
));

const TableRow = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("tr", {
    ref,
    className: cn("border-b transition-colors hover:bg-gray-50", className),
    ...props
  }, children)
));

const TableHead = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("th", {
    ref,
    className: cn("h-12 px-4 text-left align-middle font-medium text-gray-500", className),
    ...props
  }, children)
));

const TableCell = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("td", {
    ref,
    className: cn("p-4 align-middle", className),
    ...props
  }, children)
));

const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);
  const handleChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) onValueChange(newValue);
  };
  return React.createElement("div", {
    className: cn("", className),
    ...props
  }, React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { activeTab, onTabChange: handleChange });
  }));
};

const TabsList = ({ className, children, activeTab, onTabChange, ...props }) => (
  React.createElement("div", {
    className: cn("inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1", className),
    ...props
  }, React.Children.map(children, child => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, { activeTab, onTabChange });
  }))
);

const TabsTrigger = ({ value, className, children, activeTab, onTabChange, ...props }) => (
  React.createElement("button", {
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
      activeTab === value ? "bg-white shadow-sm" : "hover:bg-gray-50",
      className
    ),
    onClick: () => onTabChange && onTabChange(value),
    ...props
  }, children)
);

const TabsContent = ({ value, className, children, activeTab, ...props }) => {
  if (activeTab !== value) return null;
  return React.createElement("div", {
    className: cn("mt-2", className),
    ...props
  }, children);
};

const Alert = React.forwardRef(({ className, variant = "default", children, ...props }, ref) => {
  const variants = {
    default: "bg-white border-gray-200",
    destructive: "border-red-500 text-red-700 bg-red-50"
  };
  return React.createElement("div", {
    ref,
    role: "alert",
    className: cn("relative w-full rounded-lg border p-4", variants[variant], className),
    ...props
  }, children);
});

const AlertTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("h5", {
    ref,
    className: cn("mb-1 font-medium leading-none tracking-tight", className),
    ...props
  }, children)
));

const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  React.createElement("div", {
    ref,
    className: cn("text-sm", className),
    ...props
  }, children)
));

const Switch = React.forwardRef(({ className, checked = false, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked);
  const handleClick = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onCheckedChange) onCheckedChange(newValue);
  };
  return React.createElement("button", {
    ref,
    type: "button",
    role: "switch",
    "aria-checked": isChecked,
    onClick: handleClick,
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      isChecked ? "bg-purple-600" : "bg-gray-200",
      className
    ),
    ...props
  }, React.createElement("span", {
    className: cn(
      "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform",
      isChecked ? "translate-x-5" : "translate-x-0"
    )
  }));
});

const Checkbox = React.forwardRef(({ className, checked = false, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked);
  const handleClick = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onCheckedChange) onCheckedChange(newValue);
  };
  return React.createElement("button", {
    ref,
    type: "button",
    role: "checkbox",
    "aria-checked": isChecked,
    onClick: handleClick,
    className: cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus-visible:outline-none",
      isChecked ? "bg-purple-600 border-purple-600" : "bg-white",
      className
    ),
    ...props
  }, isChecked && React.createElement("svg", {
    className: "h-3 w-3 text-white mx-auto",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "4"
  }, React.createElement("polyline", { points: "20 6 9 17 4 12" })));
});

window.UI = {
  Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge, Input, Textarea, Label, Avatar, AvatarImage, AvatarFallback,
  Separator, Progress, ScrollArea, Skeleton,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Alert, AlertTitle, AlertDescription,
  Switch, Checkbox, cn
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
  Minus: createIcon(["M5 12h14"]),
  Search: createIcon(["M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "m21 21-4.3-4.3"]),
  Settings: createIcon(["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]),
  User: createIcon(["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"]),
  Mail: createIcon(["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z", "m22 6-10 7L2 6"]),
  Phone: createIcon(["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"]),
  Star: createIcon(["m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"]),
  Heart: createIcon(["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"]),
  Home: createIcon(["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"]),
  Menu: createIcon(["M4 12h16", "M4 6h16", "M4 18h16"]),
  ChevronDown: createIcon(["m6 9 6 6 6-6"]),
  ChevronUp: createIcon(["m18 15-6-6-6 6"]),
  ChevronLeft: createIcon(["m15 18-6-6 6-6"]),
  ChevronRight: createIcon(["m9 18 6-6-6-6"]),
  ExternalLink: createIcon(["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", "m15 3 6 6", "M10 14 21 3"]),
  Download: createIcon(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m7 10 5 5 5-5", "M12 15V3"]),
  Upload: createIcon(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "m17 8-5-5-5 5", "M12 3v12"]),
  Edit: createIcon(["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]),
  Trash: createIcon(["M3 6h18", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"]),
  Copy: createIcon(["M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", "M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"]),
  Share: createIcon(["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", "m16 6-4-4-4 4", "M12 2v13"]),
  Send: createIcon(["m22 2-7 20-4-9-9-4Z", "M22 2 11 13"]),
  Save: createIcon(["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"]),
  Loader2: createIcon(["M21 12a9 9 0 1 1-6.219-8.56"]),
  Sparkles: createIcon(["m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z", "M5 3v4", "M19 17v4", "M3 5h4", "M17 19h4"]),
  Zap: createIcon(["M13 2 3 14h9l-1 8 10-12h-9l1-8z"]),
  Rocket: createIcon(["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z", "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z", "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"]),
  Code: createIcon(["m16 18 6-6-6-6", "m8 6-6 6 6 6"]),
  Palette: createIcon(["M12 22a10 10 0 1 1 3-19.5", "M12 22a10 10 0 0 0 3-19.5"]),
  Layout: createIcon(["M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z", "M3 9h18", "M9 21V9"]),
  Image: createIcon(["M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z", "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"]),
  Globe: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M2 12h20"]),
  Link: createIcon(["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"]),
  Lock: createIcon(["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z", "M7 11V7a5 5 0 0 1 10 0v4"]),
  Eye: createIcon(["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]),
  Bell: createIcon(["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"]),
  MessageSquare: createIcon(["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]),
  Info: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 16v-4", "M12 8h.01"]),
  AlertCircle: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 8v4", "M12 16h.01"]),
  CheckCircle: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "m9 12 2 2 4-4"]),
  XCircle: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "m15 9-6 6", "m9 9 6 6"]),
  MoreHorizontal: createIcon(["M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z", "M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z", "M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"]),
  Filter: createIcon(["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"]),
  RefreshCw: createIcon(["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", "M8 16H3v5"]),
  Grid: createIcon(["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"]),
  List: createIcon(["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]),
  Play: createIcon(["m5 3 14 9-14 9V3z"]),
  TrendingUp: createIcon(["m23 6-9.5 9.5-5-5L1 18", "M17 6h6v6"]),
  BarChart: createIcon(["M12 20V10", "M18 20V4", "M6 20v-4"]),
  Target: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]),
  Award: createIcon(["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "M8.21 13.89 7 23l5-3 5 3-1.21-9.12"]),
  ShoppingCart: createIcon(["M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6", "M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z", "M20 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"]),
  CreditCard: createIcon(["M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z", "M1 10h22"]),
  DollarSign: createIcon(["M12 2v20", "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]),
  Users: createIcon(["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"]),
  Briefcase: createIcon(["M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z", "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"]),
  Calendar: createIcon(["M8 2v4", "M16 2v4", "M3 10h18", "M21 8v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"]),
  Clock: createIcon(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z", "M12 6v6l4 2"]),
  MapPin: createIcon(["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z", "M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]),
};

Object.keys(Icons).forEach(name => {
  window[name] = Icons[name];
});
window.Icons = Icons;
`;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, projectId, currentPage, existingComponents, requestType } = (await req.json()) as GenerateRequest;

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
    if (requestType) {
      contextMessage += `\nRequest Type: ${requestType}`;
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
        max_tokens: 8192,
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

    console.log("AI Response received, length:", aiContent.length);

    // Parse AI response with robust error handling
    let parsedResponse;
    try {
      // Method 1: Direct JSON parse (cleanest case)
      try {
        parsedResponse = JSON.parse(aiContent.trim());
        console.log("Parsed directly as JSON");
      } catch {
        // Method 2: Extract from ```json``` code blocks
        const jsonBlockMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonBlockMatch) {
          parsedResponse = JSON.parse(jsonBlockMatch[1].trim());
          console.log("Extracted from markdown code block");
        } else {
          // Method 3: Find JSON object pattern
          const jsonObjectMatch = aiContent.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch) {
            // Find the balanced JSON by counting braces
            const jsonStr = jsonObjectMatch[0];
            let depth = 0;
            let endIndex = 0;
            for (let i = 0; i < jsonStr.length; i++) {
              if (jsonStr[i] === '{') depth++;
              if (jsonStr[i] === '}') depth--;
              if (depth === 0) {
                endIndex = i + 1;
                break;
              }
            }
            const balancedJson = jsonStr.substring(0, endIndex);
            parsedResponse = JSON.parse(balancedJson);
            console.log("Extracted balanced JSON object");
          } else {
            throw new Error("No JSON found in response");
          }
        }
      }

      // Validate parsed response
      if (!parsedResponse.type) {
        // Legacy format without type - assume component
        parsedResponse.type = "component";
      }

    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw AI content (first 500 chars):", aiContent.substring(0, 500));
      
      // Return error instead of placeholder component
      return new Response(
        JSON.stringify({
          success: false,
          error: "AI response parsing failed",
          message: "The AI generated an invalid response. Please try again with a clearer prompt.",
          debug: aiContent.substring(0, 200)
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle conversation type response
    if (parsedResponse.type === "conversation") {
      console.log("Returning conversational response");
      return new Response(
        JSON.stringify({
          success: true,
          type: "conversation",
          response: parsedResponse.response,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle component generation
    const { componentName, code, description } = parsedResponse;

    // Validate required fields
    if (!componentName || !code) {
      console.error("Missing required fields in parsed response:", Object.keys(parsedResponse));
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid component data",
          message: "The AI response is missing componentName or code. Please try again.",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
        type: "component",
        component: result,
        description,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-component:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to generate component",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Generate live React preview HTML from component code
 */
function generateLivePreviewHtml(componentCode: string, componentName: string): string {
  // Process the code for the preview
  let processedCode = componentCode;
  
  // Remove all import statements
  processedCode = processedCode.replace(/import\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');
  
  // Remove export default statements but keep the component
  processedCode = processedCode.replace(/export\s+default\s+/g, '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview - ${componentName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { 
      margin: 0; 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script>
    ${UI_COMPONENTS_SCRIPT}
  </script>
  
  <script>
    ${LUCIDE_ICONS_SCRIPT}
  </script>
  
  <script type="text/babel">
    const { useState, useEffect, useCallback, useMemo, useRef } = React;
    
    // Destructure UI components
    const { 
      Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
      Badge, Input, Textarea, Label, Avatar, AvatarImage, AvatarFallback,
      Separator, Progress, ScrollArea, Skeleton,
      Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
      Tabs, TabsList, TabsTrigger, TabsContent,
      Alert, AlertTitle, AlertDescription,
      Switch, Checkbox, cn
    } = window.UI;
    
    // Destructure icons
    const {
      ArrowRight, ArrowLeft, Check, X, Plus, Minus, Search, Settings, User, Mail, Phone,
      Star, Heart, Home, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
      ExternalLink, Download, Upload, Edit, Trash, Copy, Share, Send, Save, Loader2,
      Sparkles, Zap, Rocket, Code, Palette, Layout, Image, Globe, Link, Lock, Eye,
      Bell, MessageSquare, Info, AlertCircle, CheckCircle, XCircle, MoreHorizontal,
      Filter, RefreshCw, Grid, List, Play, TrendingUp, BarChart, Target, Award,
      ShoppingCart, CreditCard, DollarSign, Users, Briefcase, Calendar, Clock, MapPin
    } = window.Icons;
    
    // Generated component
    ${processedCode}
    
    // Render
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<${componentName} />);
  </script>
</body>
</html>`;
}
