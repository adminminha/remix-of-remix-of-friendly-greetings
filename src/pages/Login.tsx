import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bird, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        variant: "destructive",
        title: "Google Sign In Failed",
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Welcome back! 🦜",
        description: "Successfully logged in to Tota AI",
      });
      navigate('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary via-tota-green-dark to-primary">
        {/* Animated Decorative Elements */}
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 rounded-full bg-tota-gold/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"
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
              Build Websites
              <span className="block text-tota-gold-light">With Your Voice</span>
            </h1>

            <p className="text-lg text-white/80 mb-8 max-w-md">
              Join thousands of creators building stunning websites with AI. 
              Just describe what you want, and watch the magic happen.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "10K+", label: "Websites Built" },
                { value: "95%", label: "Time Saved" },
                { value: "5K+", label: "Happy Users" }
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-tota-gold-light">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
        {/* Background decoration for mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-tota-gold/10 rounded-full blur-3xl" />
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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-tota-gold flex items-center justify-center">
                <Bird className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text font-display">Tota AI</span>
            </Link>
          </div>

          <Card className="border-border/50 shadow-2xl backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center space-y-2 pb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-tota-gold/10 flex items-center justify-center mx-auto mb-2"
              >
                <Sparkles className="h-8 w-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-bold font-display">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to continue building with AI
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google OAuth Button */}
              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-medium relative overflow-hidden group"
                onClick={handleGoogleSignIn}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-tota-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  or continue with email
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                </div>

                <button
                  type="submit"
                  className="liquid-button w-full h-12 text-white text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">
                  Create one for free
                </Link>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;