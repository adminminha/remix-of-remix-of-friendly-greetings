import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
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
            <FileText className="h-6 w-6 text-primary" />
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
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 28, 2026
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            {/* Bengali Summary */}
            <section className="bg-muted/50 p-6 rounded-lg border border-border/50">
              <h2 className="text-xl font-semibold mb-3">🇧🇩 বাংলায় সারসংক্ষেপ</h2>
              <p className="text-muted-foreground">
                Tota AI ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলী মেনে চলতে সম্মত হচ্ছেন। 
                আমাদের সেবা ব্যবহার করে আপনি ওয়েবসাইট তৈরি করতে পারবেন। আপনার তৈরি করা 
                কন্টেন্টের জন্য আপনি দায়ী থাকবেন।
              </p>
            </section>

            {/* Sections */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Tota AI's services, you agree to be bound by these 
                Terms of Service and all applicable laws and regulations. If you do not 
                agree with any of these terms, you are prohibited from using or accessing 
                this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                Tota AI provides an AI-powered website building platform that allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Create websites using natural language instructions</li>
                <li>Generate and customize web components</li>
                <li>Deploy websites to custom domains</li>
                <li>Export generated code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                To use our services, you must:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Be at least 13 years of age</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized account use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
              <p className="text-muted-foreground mb-4">
                You retain ownership of content you create using Tota AI. By using our service:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You grant us a license to host and display your content</li>
                <li>You are responsible for all content you create</li>
                <li>You must not create illegal or harmful content</li>
                <li>We may remove content that violates our policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
              <p className="text-muted-foreground mb-4">
                You may not use Tota AI to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Create websites that violate any laws</li>
                <li>Distribute malware or harmful code</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated systems to abuse our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
              <p className="text-muted-foreground mb-4">
                For paid plans:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Payments are processed securely through our payment providers</li>
                <li>Subscriptions renew automatically unless cancelled</li>
                <li>Refunds are available within 14 days of purchase</li>
                <li>We reserve the right to modify pricing with notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Tota AI platform, including its design, features, and code, is owned by 
                Tota AI and protected by intellectual property laws. Our templates and UI 
                components are provided under open-source licenses where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Tota AI is provided "as is" without warranties of any kind. We are not liable 
                for any damages arising from your use of our service, including but not limited 
                to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Service Availability</h2>
              <p className="text-muted-foreground">
                We strive to maintain high availability but do not guarantee uninterrupted 
                service. We may modify, suspend, or discontinue features with reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account for violations of these terms. 
                Upon termination, you may export your data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these terms from time to time. Continued use of our service 
                after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These terms are governed by the laws of Bangladesh. Any disputes shall be 
                resolved in the courts of Dhaka, Bangladesh.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, contact us at:
              </p>
              <p className="text-primary font-medium mt-2">
                legal@tota.ai
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

export default Terms;
