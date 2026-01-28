// Tota AI - Live React Preview Runtime
// Generates HTML that renders actual React components in an iframe using CDN-based React + Babel

/**
 * Pre-bundled UI component definitions for the preview iframe
 * These are simplified versions that work with CDN React
 */
const UI_COMPONENTS_SCRIPT = `
  // cn utility function
  const cn = (...classes) => classes.filter(Boolean).join(' ');

  // Button Component
  const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
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

  // Card Components
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

  // Badge Component
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

  // Input Component
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

  // Textarea Component
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

  // Label Component
  const Label = React.forwardRef(({ className, children, ...props }, ref) => (
    React.createElement("label", {
      ref,
      className: cn("text-sm font-medium leading-none", className),
      ...props
    }, children)
  ));

  // Avatar Components
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

  // Separator Component
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

  // Progress Component
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

  // ScrollArea (simplified)
  const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
    React.createElement("div", {
      ref,
      className: cn("relative overflow-auto", className),
      ...props
    }, children)
  ));

  // Skeleton Component
  const Skeleton = ({ className, ...props }) => (
    React.createElement("div", {
      className: cn("animate-pulse rounded-md bg-gray-200", className),
      ...props
    })
  );

  // Tabs Components (simplified)
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

  // Alert Components
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

  // Switch Component (simplified)
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
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2",
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

  // Checkbox Component (simplified)
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
        "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus-visible:outline-none focus-visible:ring-2",
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

  // Table Components
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

  // Make components globally available
  window.UI = {
    Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
    Badge, Input, Textarea, Label, Avatar, AvatarImage, AvatarFallback,
    Separator, Progress, ScrollArea, Skeleton,
    Tabs, TabsList, TabsTrigger, TabsContent,
    Alert, AlertTitle, AlertDescription,
    Switch, Checkbox,
    Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
    cn
  };
`;

/**
 * Lucide React icons as simple SVG components for preview
 */
const LUCIDE_ICONS_SCRIPT = `
  // Lucide React Icons (simplified SVG versions)
  const createIcon = (path, viewBox = "0 0 24 24") => (props) =>
    React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: props.size || 24,
      height: props.size || 24,
      viewBox,
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: props.className,
      ...props
    }, ...path.map((d, i) => React.createElement("path", { key: i, d })));

  const Icons = {
    ArrowRight: createIcon([["M5 12h14"], ["m12 5 7 7-7 7"]]),
    ArrowLeft: createIcon([["m12 19-7-7 7-7"], ["M19 12H5"]]),
    Check: createIcon([["M20 6 9 17l-5-5"]]),
    X: createIcon([["M18 6 6 18"], ["m6 6 12 12"]]),
    Plus: createIcon([["M5 12h14"], ["M12 5v14"]]),
    Minus: createIcon([["M5 12h14"]]),
    Search: createIcon([["M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"], ["m21 21-4.3-4.3"]]),
    Settings: createIcon([["M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"], ["M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"]]),
    User: createIcon([["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"], ["M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"]]),
    Mail: createIcon([["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"], ["m22 6-10 7L2 6"]]),
    Phone: createIcon([["M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"]),
    MapPin: createIcon([["M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"], ["M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]]),
    Calendar: createIcon([["M8 2v4"], ["M16 2v4"], ["M3 10h18"], ["M21 8v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"]]),
    Clock: createIcon([["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"], ["M12 6v6l4 2"]]),
    Star: createIcon([["m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"]]),
    Heart: createIcon([["M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"]]),
    Home: createIcon([["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"], ["M9 22V12h6v10"]]),
    Menu: createIcon([["M4 12h16"], ["M4 6h16"], ["M4 18h16"]]),
    ChevronDown: createIcon([["m6 9 6 6 6-6"]]),
    ChevronUp: createIcon([["m18 15-6-6-6 6"]]),
    ChevronLeft: createIcon([["m15 18-6-6 6-6"]]),
    ChevronRight: createIcon([["m9 18 6-6-6-6"]]),
    ExternalLink: createIcon([["M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"], ["m15 3 6 6"], ["M10 14 21 3"]]),
    Download: createIcon([["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"], ["m7 10 5 5 5-5"], ["M12 15V3"]]),
    Upload: createIcon([["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"], ["m17 8-5-5-5 5"], ["M12 3v12"]]),
    Edit: createIcon([["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"], ["M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]]),
    Trash: createIcon([["M3 6h18"], ["M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"], ["M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"]]),
    Copy: createIcon([["M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"], ["M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"]]),
    Share: createIcon([["M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"], ["m16 6-4-4-4 4"], ["M12 2v13"]]),
    Send: createIcon([["m22 2-7 20-4-9-9-4Z"], ["M22 2 11 13"]]),
    Save: createIcon([["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"], ["M17 21v-8H7v8"], ["M7 3v5h8"]]),
    Loader2: createIcon([["M21 12a9 9 0 1 1-6.219-8.56"]]),
    Sparkles: createIcon([["m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"], ["M5 3v4"], ["M19 17v4"], ["M3 5h4"], ["M17 19h4"]]),
    Zap: createIcon([["M13 2 3 14h9l-1 8 10-12h-9l1-8z"]]),
    Rocket: createIcon([["M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"], ["m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"], ["M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"], ["M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"]]),
    Code: createIcon([["m16 18 6-6-6-6"], ["m8 6-6 6 6 6"]]),
    Palette: createIcon([["M12 22a10 10 0 1 1 0-20 10 10 0 0 1 10 10c0 5-4 5-6 3-1-1-2.5-.5-2.5 1.5v.5a3 3 0 0 1-3 3v.5c-1 0-1.5 1.5-1.5 1.5"]]),
    Layout: createIcon([["M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"], ["M3 9h18"], ["M9 21V9"]]),
    Image: createIcon([["M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"], ["M8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"], ["m21 15-5-5L5 21"]]),
    Globe: createIcon([["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"], ["M2 12h20"], ["M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"]]),
    Link: createIcon([["M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"], ["M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"]]),
    Lock: createIcon([["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"], ["M7 11V7a5 5 0 0 1 10 0v4"]]),
    Eye: createIcon([["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"], ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"]]),
    Bell: createIcon([["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"], ["M13.73 21a2 2 0 0 1-3.46 0"]]),
    MessageSquare: createIcon([["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]]),
    Info: createIcon([["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"], ["M12 16v-4"], ["M12 8h.01"]]),
    AlertCircle: createIcon([["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"], ["M12 8v4"], ["M12 16h.01"]]),
    CheckCircle: createIcon([["M22 11.08V12a10 10 0 1 1-5.93-9.14"], ["M22 4 12 14.01l-3-3"]])
  };

  // Make icons globally available
  window.Icons = Icons;
  Object.assign(window, Icons);
`;

/**
 * Generate complete preview HTML with React runtime
 */
export function generateLivePreviewHtml(
  componentCode: string,
  componentName: string
): string {
  // Clean the component code for embedding
  const cleanedCode = componentCode
    // Remove import statements (we provide components globally)
    .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')
    // Replace @/components/ui/* imports usage with window.UI
    .replace(/\b(Button|Card|CardHeader|CardTitle|CardDescription|CardContent|CardFooter|Badge|Input|Textarea|Label|Avatar|AvatarImage|AvatarFallback|Separator|Progress|ScrollArea|Skeleton|Tabs|TabsList|TabsTrigger|TabsContent|Alert|AlertTitle|AlertDescription|Switch|Checkbox|Table|TableHeader|TableBody|TableRow|TableHead|TableCell)\b(?=\s*[<(])/g, 'UI.$1')
    // Keep Icon usage as is (they're in global scope)
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
    .preview-error { 
      padding: 20px; 
      background: #fef2f2; 
      color: #dc2626; 
      border-radius: 8px;
      margin: 20px;
    }
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
  
  <script>
    ${UI_COMPONENTS_SCRIPT}
  </script>
  
  <script>
    ${LUCIDE_ICONS_SCRIPT}
  </script>
  
  <script type="text/babel">
    try {
      // User's component code
      ${cleanedCode}
      
      // Render the component
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(ExportedComponent || ${componentName}));
    } catch (error) {
      console.error('Preview Error:', error);
      document.getElementById('root').innerHTML = \`
        <div class="preview-error">
          <strong>Preview Error:</strong><br/>
          \${error.message}
        </div>
      \`;
    }
  </script>
</body>
</html>`;
}

/**
 * Generate a simple static HTML fallback when React preview fails
 */
export function generateStaticPreviewHtml(
  componentCode: string,
  componentName: string
): string {
  // Extract the JSX return content
  const returnMatch = componentCode.match(/return\s*\(\s*([\s\S]*?)\s*\);?\s*\}[\s\S]*?(?:export|$)/);
  let htmlContent = returnMatch ? returnMatch[1] : '<div>Preview not available</div>';
  
  // Convert JSX to HTML
  htmlContent = htmlContent
    .replace(/className=/g, 'class=')
    .replace(/\{[^}]+\}/g, '')
    .replace(/<Button([^>]*)>(.*?)<\/Button>/gi, '<button class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-purple-600 text-white px-4 py-2 hover:bg-purple-700"$1>$2</button>')
    .replace(/<Card([^>]*)>([\s\S]*?)<\/Card>/gi, '<div class="rounded-lg border bg-white shadow-sm p-6"$1>$2</div>')
    .replace(/<Badge([^>]*)>(.*?)<\/Badge>/gi, '<span class="inline-flex items-center rounded-full bg-purple-600 text-white px-2.5 py-0.5 text-xs font-semibold"$1>$2</span>')
    .replace(/<Input([^>]*?)\/>/gi, '<input class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"$1 />')
    .replace(/<([A-Z]\w+)([^>]*?)\/>/gi, '<div$2></div>')
    .replace(/<([A-Z]\w+)([^>]*)>([\s\S]*?)<\/\1>/gi, '<div$2>$3</div>');

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
