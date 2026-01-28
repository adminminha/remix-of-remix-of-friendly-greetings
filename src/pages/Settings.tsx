import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bird, User, Shield, CreditCard, ArrowLeft, Camera, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  plan_type: string;
}

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFullName(data.full_name || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['3 projects', '100 AI generations/month', 'Community support'],
      current: profile?.plan_type === 'free',
    },
    {
      name: 'Pro',
      price: '$15',
      features: ['Unlimited projects', '1000 AI generations/month', 'Priority support', 'Custom domains'],
      current: profile?.plan_type === 'pro',
      recommended: true,
    },
    {
      name: 'Business',
      price: '$49',
      features: ['Everything in Pro', 'Unlimited AI generations', 'Team collaboration', 'White-label'],
      current: profile?.plan_type === 'business',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="h-4 w-4" />
                      Change Avatar
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG, or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveProfile} disabled={saving} className="liquid-button gap-2">
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your projects via email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sign Out</p>
                      <p className="text-sm text-muted-foreground">
                        Sign out from all devices
                      </p>
                    </div>
                    <Button variant="outline" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>
                    You are currently on the{' '}
                    <span className="font-semibold text-foreground capitalize">
                      {profile?.plan_type || 'Free'}
                    </span>{' '}
                    plan
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.name}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`border-border/50 h-full relative ${plan.current ? 'border-primary ring-1 ring-primary' : ''}`}>
                      {plan.recommended && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-secondary">
                          Recommended
                        </Badge>
                      )}
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {plan.name}
                          {plan.current && (
                            <Badge variant="outline">Current</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full mt-6 ${plan.current ? '' : 'liquid-button'}`}
                          variant={plan.current ? 'outline' : 'default'}
                          disabled={plan.current}
                        >
                          {plan.current ? 'Current Plan' : 'Upgrade'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
