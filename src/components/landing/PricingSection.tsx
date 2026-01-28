import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    icon: Sparkles,
    price: "0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 Projects",
      "Basic AI Features",
      "Community Support",
      "Tota.ai Subdomain",
      "Basic Templates",
    ],
    buttonText: "Start Free",
    buttonStyle: "liquid-button-outline",
    popular: false,
    action: "register",
  },
  {
    name: "Pro",
    icon: Crown,
    price: "15",
    period: "per month",
    description: "Best for professionals",
    features: [
      "Unlimited Projects",
      "Advanced AI Features",
      "Priority Support",
      "Custom Domains",
      "Premium Templates",
      "Code Export",
      "Remove Branding",
      "Analytics Dashboard",
    ],
    buttonText: "Start Pro Trial",
    buttonStyle: "liquid-button",
    popular: true,
    action: "register",
  },
  {
    name: "Business",
    icon: Building2,
    price: "49",
    period: "per month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Team Collaboration",
      "White Label",
      "API Access",
      "Custom Integrations",
      "Dedicated Support",
      "SLA Guarantee",
      "Advanced Analytics",
    ],
    buttonText: "Contact Sales",
    buttonStyle: "liquid-button-gold",
    popular: false,
    action: "contact",
  },
];

export const PricingSection = () => {
  const navigate = useNavigate();

  const handlePlanClick = (action: string) => {
    if (action === "register") {
      navigate('/register');
    } else if (action === "contact") {
      // Scroll to FAQ or open contact form
      const element = document.querySelector("#faq");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display mt-4 mb-6">
            Simple, Transparent
            <span className="gradient-text block">Pricing for Everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start for free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-tota-gold to-tota-gold-dark text-white px-4 py-1 shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card
                className={`h-full card-hover ${
                  plan.popular
                    ? "border-2 border-primary shadow-xl shadow-primary/10"
                    : "border-border/50"
                }`}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      plan.popular
                        ? "bg-gradient-to-br from-primary to-tota-green-dark"
                        : "bg-muted"
                    }`}
                  >
                    <plan.icon
                      className={`w-7 h-7 ${
                        plan.popular ? "text-white" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                  
                  <div className="mt-6">
                    <span className="text-5xl font-bold font-display">${plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.popular ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <Check className={`w-3 h-3 ${
                            plan.popular ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    className={`${plan.buttonStyle} w-full text-white`}
                    onClick={() => handlePlanClick(plan.action)}
                  >
                    <span>{plan.buttonText}</span>
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            🛡️ 14-day money-back guarantee • No credit card required for free plan
          </p>
        </motion.div>
      </div>
    </section>
  );
};
