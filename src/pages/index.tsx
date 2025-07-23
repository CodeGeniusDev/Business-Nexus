import React, { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, TrendingUp, MessageCircle, Star, CheckCircle } from "lucide-react";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/components/Dashboard";
import { useAuth } from "@/contexts/AuthContext";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user } = useAuth();

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  if (user) {
    return <Dashboard />;
  }

  return (
    <>
      <Head>
        <title>Business Nexus - Connect Entrepreneurs & Investors</title>
        <meta name="description" content="The premier networking platform connecting entrepreneurs with investors. Build meaningful partnerships and grow your business." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Navigation */}
        <motion.nav 
          className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="text-2xl font-bold text-primary">
                Business<span className="text-blue-600">Nexus</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  🚀 Connecting Innovation with Investment
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight"
                variants={fadeInUp}
              >
                Where Entrepreneurs
                <br />
                <span className="text-blue-600">Meet Investors</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                Join the premier networking platform that connects visionary entrepreneurs 
                with strategic investors. Build meaningful partnerships, secure funding, 
                and accelerate your business growth.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                variants={fadeInUp}
              >
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                >
                  Start Networking <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleSignIn}
                  className="px-8 py-4 text-lg"
                >
                  Sign In
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Hero Image */}
        <motion.section 
          className="px-4 sm:px-6 lg:px-8 mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&crop=center"
                alt="Business networking and collaboration"
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-slate-600">Active Entrepreneurs</div>
              </motion.div>
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
                <div className="text-slate-600">Verified Investors</div>
              </motion.div>
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="text-4xl font-bold text-blue-600 mb-2">$2B+</div>
                <div className="text-slate-600">Funding Facilitated</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Our platform provides all the tools and connections you need to build 
                successful partnerships and grow your business.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Smart Matching</CardTitle>
                    <CardDescription>
                      Our AI-powered algorithm connects you with the most relevant partners 
                      based on your industry, stage, and investment criteria.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Real-time Chat</CardTitle>
                    <CardDescription>
                      Communicate directly with potential partners through our secure, 
                      real-time messaging system with file sharing capabilities.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-0 bg-gradient-to-br from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>Deal Tracking</CardTitle>
                    <CardDescription>
                      Track your collaboration requests, manage your pipeline, and 
                      monitor the progress of your partnerships in one place.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                How Business Nexus Works
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Get started in minutes and begin building meaningful connections today.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="text-center" variants={fadeInUp}>
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Create Your Profile</h3>
                <p className="text-slate-600">
                  Sign up and create a comprehensive profile showcasing your business, 
                  experience, and what you're looking for.
                </p>
              </motion.div>

              <motion.div className="text-center" variants={fadeInUp}>
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Discover Matches</h3>
                <p className="text-slate-600">
                  Browse through curated matches of entrepreneurs and investors 
                  that align with your interests and criteria.
                </p>
              </motion.div>

              <motion.div className="text-center" variants={fadeInUp}>
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Start Collaborating</h3>
                <p className="text-slate-600">
                  Send collaboration requests, chat in real-time, and build 
                  the partnerships that will drive your success.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Trusted by Industry Leaders
              </h2>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card className="border-0">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-6 text-lg">
                      "Business Nexus connected me with the perfect investor for my FinTech startup. 
                      The platform made it easy to showcase my vision and find someone who truly 
                      understood my market."
                    </p>
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
                        alt="Sarah Johnson"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="font-semibold">Sarah Johnson</div>
                        <div className="text-slate-500">CEO, EcoTech Solutions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-0">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-6 text-lg">
                      "As an investor, I've found some of my best portfolio companies through 
                      Business Nexus. The quality of entrepreneurs and the ease of communication 
                      is unmatched."
                    </p>
                    <div className="flex items-center">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                        alt="John Smith"
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <div className="font-semibold">John Smith</div>
                        <div className="text-slate-500">Managing Partner, TechVentures</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Build Your Network?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of entrepreneurs and investors who are already building 
                successful partnerships on Business Nexus.
              </p>
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-4">
                Business<span className="text-blue-400">Nexus</span>
              </div>
              <p className="text-slate-400 mb-8">
                Connecting entrepreneurs with investors worldwide.
              </p>
              <div className="text-slate-500">
                © 2024 Business Nexus. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      </div>
    </>
  );
}