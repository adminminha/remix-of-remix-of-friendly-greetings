import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Bird, Calendar } from "lucide-react";

export const CTASection = () => {
  const navigate = useNavigate();

  const handleScheduleDemo = () => {
    // Scroll to contact or open demo scheduling
    const element = document.querySelector("#faq");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-tota-green-dark to-primary" />
      
      {/* Decorative Elements */}
      <motion.div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10" animate={{
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3]
    }} transition={{
      duration: 4,
      repeat: Infinity
    }} />
      <motion.div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-tota-gold/20" animate={{
      scale: [1, 1.3, 1],
      opacity: [0.2, 0.4, 0.2]
    }} transition={{
      duration: 5,
      repeat: Infinity
    }} />
      <motion.div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/5" animate={{
      y: [0, -20, 0]
    }} transition={{
      duration: 3,
      repeat: Infinity
    }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
      backgroundImage: `linear-gradient(white 1px, transparent 1px), 
                           linear-gradient(90deg, white 1px, transparent 1px)`,
      backgroundSize: '60px 60px'
    }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="mb-8">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto animate-pulse-glow">
              <Bird className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h2 initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6">
            Ready to Build Your
            <span className="block text-tota-gold-light">Dream Website?</span>
          </motion.h2>

          {/* Description */}
          <motion.p initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are building amazing websites 
            with AI. Start for free, no credit card required.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              className="liquid-button-gold text-lg group"
              onClick={() => navigate('/register')}
            >
              <span className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5" />
                Start Building for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button 
              className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              onClick={handleScheduleDemo}
            >
              <Calendar className="w-5 h-5" />
              <span>Schedule Demo</span>
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.5
        }} className="mt-12 flex flex-wrap justify-center items-center gap-8">
            <div className="text-white/60 text-sm">Trusted by</div>
            <div className="flex items-center gap-6">
              {["5,000+", "Creators", "50+", "Countries"].map((text, i) => <span key={i} className={`text-white ${i % 2 === 0 ? "text-2xl font-bold" : "text-sm opacity-60"}`}>
                  {text}
                </span>)}
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};