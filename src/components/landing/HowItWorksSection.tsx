import { motion } from "framer-motion";
import { MessageSquare, Wand2, Rocket, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe Your Vision",
    description: "Tell our AI what kind of website you want. Describe the style, sections, and features you need.",
    color: "from-primary to-tota-green-dark",
  },
  {
    number: "02",
    icon: Wand2,
    title: "AI Creates It",
    description: "Watch as Tota AI transforms your words into a beautiful, fully functional website in seconds.",
    color: "from-tota-gold to-tota-gold-dark",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Publish & Share",
    description: "Deploy your website with one click. Get a custom domain and share it with the world.",
    color: "from-primary to-tota-green-dark",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-muted/30">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4 mb-6">
            Three Simple Steps to
            <span className="gradient-text block">Your Dream Website</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No coding. No design skills. Just tell us what you want and we'll handle the rest.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex items-center gap-8 md:gap-16 mb-16 last:mb-0 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Number & Icon */}
              <div className="relative flex-shrink-0">
                <motion.div
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon className="w-10 h-10 md:w-14 md:h-14 text-white" />
                </motion.div>
                <span className="absolute -top-3 -left-3 text-6xl md:text-7xl font-bold text-muted/50 font-display">
                  {step.number}
                </span>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-full left-1/2 w-px h-16 bg-gradient-to-b from-border to-transparent mt-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 font-display">
                  {step.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                {/* Checkmarks */}
                <div className="flex flex-wrap gap-4 mt-6">
                  {["Fast", "Easy", "Powerful"].map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
