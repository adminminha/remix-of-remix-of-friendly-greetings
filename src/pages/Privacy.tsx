import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Tota AI</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 28, 2026
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {/* Bengali Summary */}
            <section className="bg-muted/50 p-6 rounded-lg border border-border/50">
              <h2 className="text-xl font-semibold mb-3">🇧🇩 বাংলায় সারসংক্ষেপ</h2>
              <p className="text-muted-foreground">
                আমরা আপনার গোপনীয়তাকে সম্মান করি। আমরা শুধুমাত্র সেসব তথ্য সংগ্রহ করি 
                যা আমাদের সেবা প্রদানের জন্য প্রয়োজন। আপনার ডেটা নিরাপদে সংরক্ষিত থাকে 
                এবং কখনোই তৃতীয় পক্ষের কাছে বিক্রি করা হয় না।
              </p>
            </section>

            {/* Sections */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Account information (email, name, password)</li>
                <li>Project data (websites, components, content you create)</li>
                <li>Usage information (how you interact with our services)</li>
                <li>Communication data (support requests, feedback)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Develop new products and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect 
                your personal information against unauthorized access, alteration, disclosure, 
                or destruction. This includes encryption, secure servers, and regular security audits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Service providers who assist in our operations</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners with your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
              <p className="text-muted-foreground">
                We use cookies and similar technologies to provide and improve our services. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not intended for children under 13. We do not knowingly 
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you 
                of any changes by posting the new policy on this page and updating the 
                "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-primary font-medium mt-2">
                privacy@tota.ai
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 Tota AI. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
