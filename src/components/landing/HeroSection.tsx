import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play, Zap, Globe, Bird } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  const navigate = useNavigate();

  const handleWatchDemo = () => {
    // Scroll to how-it-works section for demo
    const element = document.querySelector("#how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div className="absolute top-20 -left-40 w-96 h-96 rounded-full bg-gradient-to-r from-primary/30 to-tota-gold/20 blur-3xl" animate={{
        x: [0, 50, 0],
        y: [0, 30, 0]
      }} transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute bottom-20 -right-40 w-96 h-96 rounded-full bg-gradient-to-r from-tota-gold/30 to-primary/20 blur-3xl" animate={{
        x: [0, -50, 0],
        y: [0, -30, 0]
      }} transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/10 via-transparent to-transparent" animate={{
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3]
      }} transition={{
        duration: 5,
        repeat: Infinity
      }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), 
                             linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="mb-8 py-[17px]">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer" onClick={() => navigate('/register')}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Website Builder
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-tight mb-6">
            Build Websites by
            <br />
            <span className="shimmer">Talking to AI</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Just describe what you want in plain language. 
            <span className="text-primary font-medium"> Tota AI </span> 
            transforms your words into stunning, professional websites in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              className="liquid-button text-white text-lg group"
              onClick={() => navigate('/register')}
            >
              <span className="flex items-center gap-2">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              className="liquid-button-outline text-lg group"
              onClick={handleWatchDemo}
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="flex flex-wrap justify-center gap-8 md:gap-16 mb-16">
            {[{
            label: "Websites Built",
            value: "10K+"
          }, {
            label: "Time Saved",
            value: "95%"
          }, {
            label: "Happy Users",
            value: "5K+"
          }].map((stat, index) => <motion.div key={stat.label} className="text-center" whileHover={{
            scale: 1.05
          }}>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>)}
          </motion.div>

          {/* Preview Window */}
          <motion.div initial={{
          opacity: 0,
          y: 50,
          scale: 0.95
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.5
        }} className="relative">
            {/* Browser Chrome */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded-lg px-4 py-1.5 text-sm text-muted-foreground flex items-center gap-2 max-w-md mx-auto">
                    <Globe className="w-4 h-4" />
                    tota.ai/builder
                  </div>
                </div>
              </div>
              
              {/* Mock Builder Interface */}
              <div className="aspect-video bg-gradient-to-br from-muted to-background p-6 md:p-10">
                <div className="h-full flex gap-6">
                  {/* Chat Side */}
                  <div className="w-2/5 bg-background rounded-xl border border-border p-4 shadow-lg">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                      <Bird className="w-5 h-5 text-primary" />
                      <span className="font-semibold">AI Assistant</span>
                    </div>
                    <div className="space-y-3">
                      <motion.div className="bg-muted rounded-lg p-3 text-sm max-w-[80%]" initial={{
                      opacity: 0,
                      x: -20
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: 1
                    }}>
                        Hi! What would you like to build? 🎨
                      </motion.div>
                      <motion.div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm max-w-[80%] ml-auto" initial={{
                      opacity: 0,
                      x: 20
                    }} animate={{
                      opacity: 1,
                      x: 0
                    }} transition={{
                      delay: 1.5
                    }}>
                        Create a portfolio with a hero section
                      </motion.div>
                      <motion.div className="flex items-center gap-1 text-muted-foreground text-sm" initial={{
                      opacity: 0
                    }} animate={{
                      opacity: 1
                    }} transition={{
                      delay: 2
                    }}>
                        <Zap className="w-4 h-4 text-tota-gold animate-pulse" />
                        Creating your website...
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Preview Side */}
                  <div className="flex-1 bg-background rounded-xl border border-border overflow-hidden shadow-lg">
                    <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-tota-gold/5">
                      <motion.div className="text-center" initial={{
                      opacity: 0,
                      scale: 0.9
                    }} animate={{
                      opacity: 1,
                      scale: 1
                    }} transition={{
                      delay: 2.2
                    }}>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-muted-foreground text-sm">Live Preview</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div className="absolute -top-4 -right-4 bg-tota-gold text-tota-gold-dark px-4 py-2 rounded-full text-sm font-semibold shadow-lg" animate={{
            y: [0, -10, 0]
          }} transition={{
            duration: 3,
            repeat: Infinity
          }}>
              <Zap className="w-4 h-4 inline mr-1" />
              AI Powered
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>;
};