import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need any coding experience to use Tota AI?",
    answer:
      "No, absolutely not! Tota AI is designed for everyone. Simply describe what you want in plain language, and our AI will create the website for you. You can build professional websites without writing a single line of code.",
  },
  {
    question: "Can I export my website code?",
    answer:
      "Yes! Pro and Business users can export their website as clean, production-ready React or HTML code. You can then host it anywhere or customize it further with your own development team.",
  },
  {
    question: "How does the AI understand my requirements?",
    answer:
      "Our AI is trained on millions of websites and understands natural language. You can describe your website in English, Bengali, or other languages. It interprets your intent and creates beautiful, functional designs based on your description.",
  },
  {
    question: "Can I use my own domain?",
    answer:
      "Yes! Pro and Business plans include custom domain support. You can connect your own domain or use our free subdomain (yoursite.tota.ai) for free tier projects.",
  },
  {
    question: "Is there a limit to how many websites I can create?",
    answer:
      "Free users can create up to 3 projects. Pro users get unlimited projects, and Business users also get unlimited projects plus team collaboration features.",
  },
  {
    question: "What happens after my free trial ends?",
    answer:
      "Your free plan never expires! You can use Tota AI free forever with basic features. If you want advanced features like custom domains, code export, or unlimited projects, you can upgrade to Pro or Business anytime.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Yes! Our Business plan includes team collaboration features. Multiple team members can work on the same project in real-time, leave comments, and manage version history.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with your Pro or Business plan, contact us within 14 days for a full refund, no questions asked.",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Frequently Asked
            <span className="gradient-text block">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We've got answers. If you can't find what you're 
            looking for, feel free to contact our support team.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-xl px-6 bg-card/50 backdrop-blur-sm data-[state=open]:shadow-lg data-[state=open]:border-primary/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                  <span className="pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a href="#" className="text-primary font-medium hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
