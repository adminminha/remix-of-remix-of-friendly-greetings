import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Zap, 
  Smartphone, 
  Palette, 
  Code2, 
  Globe,
  Sparkles,
  Shield
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MessageSquare,
    title: "Chat to Build",
    description: "Simply describe what you want in plain language. No coding knowledge required.",
    color: "from-primary to-tota-green-dark",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "See changes in real-time as you describe them. Lightning-fast AI generation.",
    color: "from-tota-gold to-tota-gold-dark",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Every website is automatically optimized for all devices and screen sizes.",
    color: "from-primary to-tota-green-dark",
  },
  {
    icon: Palette,
    title: "Beautiful Designs",
    description: "Professional templates and AI-powered styling that matches your brand.",
    color: "from-tota-gold to-tota-gold-dark",
  },
  {
    icon: Code2,
    title: "Export Code",
    description: "Download clean, production-ready React or HTML code anytime.",
    color: "from-primary to-tota-green-dark",
  },
  {
    icon: Globe,
    title: "One-Click Deploy",
    description: "Publish your website instantly with custom domain support.",
    color: "from-tota-gold to-tota-gold-dark",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Everything You Need to
            <span className="gradient-text block">Build Amazing Websites</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform gives you all the tools to create, customize, 
            and deploy professional websites without any technical skills.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="card-hover h-full border-border/50 bg-card/50 backdrop-blur-sm group">
                <CardContent className="p-8">
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 p-2 rounded-full bg-muted/50 border border-border">
            <div className="flex items-center gap-2 px-4 py-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2 px-4 py-2">
              <Zap className="w-5 h-5 text-tota-gold" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 px-4 py-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Global CDN</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
