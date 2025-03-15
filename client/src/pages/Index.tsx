
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User } from '@/lib/types';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  // Redirect logged in users to their dashboard
  useEffect(() => {
    if (user) {
      const dashboardUrl = user.role === 'patient' ? '/patient/dashboard' : '/insurer/dashboard';
      navigate(dashboardUrl);
    }
  }, [user, navigate]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background -z-10" />
        
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full inline-block">
                  Simplified Claims Management
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Streamline Your Healthcare Claims
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground">
                ClaimBridge connects patients and insurers through an intuitive platform, simplifying the entire claims process from submission to resolution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="font-medium">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-medium">
                  <Link to="/login">Learn More</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div 
              className="relative p-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="aspect-video bg-gradient-to-tr from-primary/20 to-primary/5 rounded-lg overflow-hidden shadow-lg">
                <div className="h-full w-full glass p-6 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-medium mb-2">Seamless Process</h3>
                    <p className="text-muted-foreground">Submit and track claims with ease</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-card glass p-6 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <div className="h-3 w-3 rounded-full bg-status-approved"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Real-time Updates</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get notified instantly when your claim status changes
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Designed for Both Sides</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Our platform serves both patients and insurers with specialized features for each role.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div 
              className="bg-card glass rounded-lg p-6"
              variants={item}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Easy Claim Submission</h3>
              <p className="text-muted-foreground">
                Streamlined forms and document uploads make submitting claims quick and hassle-free.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              className="bg-card glass rounded-lg p-6"
              variants={item}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Status Tracking</h3>
              <p className="text-muted-foreground">
                Real-time updates on claim status, approved amounts, and insurer feedback.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              className="bg-card glass rounded-lg p-6"
              variants={item}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Efficient Processing</h3>
              <p className="text-muted-foreground">
                Comprehensive tools for insurers to review, approve, and process claims quickly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Claims?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join ClaimBridge today and experience a streamlined approach to healthcare claims management.
          </p>
          <Button asChild size="lg" className="font-medium">
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
