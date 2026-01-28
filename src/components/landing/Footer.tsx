import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bird, Twitter, Github, Linkedin, Mail, Heart } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Templates", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  Resources: [
    { name: "Documentation", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Support", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Partners", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "#" },
    { name: "Cookies", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@tota.ai", label: "Email" },
];

export const Footer = () => {
  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to="/"
                className="flex items-center gap-2 text-2xl font-bold mb-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-tota-gold flex items-center justify-center">
                  <Bird className="w-6 h-6 text-white" />
                </div>
                <span className="gradient-text font-display">Tota AI</span>
              </Link>
            </motion.div>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Build stunning websites by simply talking to AI. 
              No coding required.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("#") ? (
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </button>
                    ) : link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Tota AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> using AI
          </p>
        </div>
      </div>
    </footer>
  );
};
