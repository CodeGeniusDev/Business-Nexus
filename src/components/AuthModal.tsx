import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Eye, EyeOff, User, Building, Mail, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onModeChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'entrepreneur' as UserRole,
    bio: '',
    // Entrepreneur fields
    startupName: '',
    pitchSummary: '',
    fundingNeed: '',
    // Investor fields
    investmentInterests: [] as string[],
    portfolioCompanies: [] as string[]
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        onClose();
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await register(registerForm);
      if (success) {
        toast({
          title: "Welcome to Business Nexus!",
          description: "Your account has been created successfully.",
        });
        onClose();
      } else {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setRegisterForm(prev => ({
        ...prev,
        investmentInterests: [...prev.investmentInterests, interest]
      }));
    } else {
      setRegisterForm(prev => ({
        ...prev,
        investmentInterests: prev.investmentInterests.filter(i => i !== interest)
      }));
    }
  };

  const commonInterests = ['FinTech', 'HealthTech', 'EdTech', 'AI/ML', 'SaaS', 'E-commerce', 'CleanTech', 'Blockchain'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === 'login' ? 'Welcome Back' : 'Join Business Nexus'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleLogin}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => onModeChange('register')}
                  >
                    Sign up
                  </button>
                </p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Demo Accounts:</p>
                <div className="space-y-1 text-xs text-blue-700">
                  <p><strong>Investor:</strong> john.investor@example.com</p>
                  <p><strong>Entrepreneur:</strong> sarah.entrepreneur@example.com</p>
                  <p><strong>Password:</strong> Any password works for demo</p>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleRegister}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>I am a...</Label>
                  <RadioGroup
                    value={registerForm.role}
                    onValueChange={(value: UserRole) => setRegisterForm(prev => ({ ...prev, role: value }))}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="entrepreneur" id="entrepreneur" />
                      <Label htmlFor="entrepreneur">Entrepreneur</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="investor" id="investor" />
                      <Label htmlFor="investor">Investor</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={registerForm.bio}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>

                {registerForm.role === 'entrepreneur' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="startupName">Startup Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="startupName"
                          type="text"
                          placeholder="Your startup name"
                          className="pl-10"
                          value={registerForm.startupName}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, startupName: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pitchSummary">Pitch Summary</Label>
                      <Textarea
                        id="pitchSummary"
                        placeholder="Brief description of your startup..."
                        value={registerForm.pitchSummary}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, pitchSummary: e.target.value }))}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fundingNeed">Funding Need</Label>
                      <Input
                        id="fundingNeed"
                        type="text"
                        placeholder="e.g., $1M Series A"
                        value={registerForm.fundingNeed}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, fundingNeed: e.target.value }))}
                      />
                    </div>
                  </motion.div>
                )}

                {registerForm.role === 'investor' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-3">
                      <Label>Investment Interests</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {commonInterests.map((interest) => (
                          <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={registerForm.investmentInterests.includes(interest)}
                              onChange={(e) => handleInterestChange(interest, e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => onModeChange('login')}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;