import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bird, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Sparkles, Chrome, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signInWithGoogle } = useAuth();

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        variant: "destructive",
        title: "Google Sign Up Failed",
        description: error.message,
      });
    }
  };

  const passwordChecks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description: "Please meet all password requirements",
      });
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Account Created! 🎉",
        description: "Please check your email to verify your account",
      });
      navigate('/login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-tota-gold via-tota-gold-dark to-primary">
        {/* Animated Decorative Elements */}
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), 
                           linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Floating Elements */}
        <motion.div 
          className="absolute top-1/3 right-20 bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Zap className="w-8 h-8 text-white" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="flex items-center gap-3 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bird className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold font-display">Tota AI</span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold font-display leading-tight mb-6">
              Start Building
              <span className="block text-white/90">Your Dream Website</span>
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-md">
              No coding required. Just describe what you want in plain language 
              and let AI do the magic. Get started in seconds.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                "AI-powered website generation",
                "Bangla & English support",
                "Export code anytime",
                "Free forever plan"
              ].map((feature, i) => (
                <motion.div 
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-tota-gold/5">
        {/* Background decoration for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-tota-gold/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tota-gold to-primary flex items-center justify-center">
                <Bird className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text font-display">Tota AI</span>
            </Link>
          </div>

          <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center space-y-2 pb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-tota-gold/10 to-primary/10 flex items-center justify-center mx-auto mb-2"
              >
                <Sparkles className="h-8 w-8 text-tota-gold" />
              </motion.div>
              <CardTitle className="text-2xl font-bold font-display">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Start building websites with AI today
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Google OAuth Button */}
              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium relative overflow-hidden group"
                onClick={handleGoogleSignUp}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-tota-gold/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Chrome className="w-5 h-5 mr-3" />
                Sign up with Google
              </Button>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  or register with email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-11 h-12 border-border/50 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 border-border/50 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 pr-11 h-12 border-border/50 focus:border-primary transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 mt-3"
                    >
                      {/* Strength Bar */}
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <div 
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              passwordStrength >= level 
                                ? passwordStrength === 3 
                                  ? 'bg-primary' 
                                  : passwordStrength === 2 
                                    ? 'bg-tota-gold' 
                                    : 'bg-destructive'
                                : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Requirements */}
                      <div className="grid grid-cols-1 gap-1.5">
                        {[
                          { check: passwordChecks.length, text: '8+ characters' },
                          { check: passwordChecks.hasUpper, text: 'Uppercase letter' },
                          { check: passwordChecks.hasNumber, text: 'Number' },
                        ].map((item, i) => (
                          <motion.div 
                            key={i} 
                            className="flex items-center gap-2 text-xs"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                              item.check ? 'bg-primary text-white' : 'bg-muted'
                            }`}>
                              {item.check && <Check className="h-2.5 w-2.5" />}
                            </div>
                            <span className={item.check ? 'text-foreground' : 'text-muted-foreground'}>
                              {item.text}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                <button
                  type="submit"
                  className="liquid-button-gold w-full h-12 text-base"
                  disabled={loading || !isPasswordValid}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2 text-white">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-white">
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;