import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User } from "@/lib/types";
import { getCurrentUser } from "@/lib/mockData";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    if (user) {
      const dashboardUrl =
        user.role === "patient" ? "/patient/dashboard" : "/insurer/dashboard";
      navigate(dashboardUrl);
    }
  }, [user, navigate]);

  return (
    <div className="min-h[calc(100vh-4rem)] flex flex-col">

      {/* Homepage Section */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background -z-10"></div>
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full inline-block">Simplified Claims Management</span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Streamline Your Healthcare Claims</h1>
                </div>

                <p className="text-lg text-muted-foreground">
                ClaimBridge connects patients and insurers through an intuitive platform, simplifying the entire claims process from submission to resolution.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size='lg' className="font-medium">
                  <Link to='/login'>Get Started</Link>
                </Button>
                <Button asChild variant="outline" size='lg' className="font-medium">
                  <Link to='/login'>Learn More</Link>
                </Button>
              </div>
              </motion.div>
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

      {/* Feature Section */}

      {/* Footer Section */}
    </div>
  );
};

export default Index;
