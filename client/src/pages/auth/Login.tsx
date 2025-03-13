
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, setCurrentUser, getCurrentUser } from '@/lib/mockData';
import { UserRole } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [role, setRole] = useState<UserRole>('patient');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const redirectPath = user.role === 'patient' ? '/patient/dashboard' : '/insurer/dashboard';
      navigate(redirectPath);
    }
  }, [navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // For demo purposes, we'll just check if the email matches a mock user with the selected role
    const user = mockUsers.find(u => u.email === data.email && u.role === role);
    
    if (user) {
      // Store user in localStorage
      setCurrentUser(user);
      
      // Show success toast
      toast({
        title: "Login successful!",
        description: `Welcome back, ${user.name}`,
      });
      
      // Redirect based on role
      const redirectPath = role === 'patient' ? '/patient/dashboard' : '/insurer/dashboard';
      navigate(redirectPath);
    } else {
      // Show error toast
      toast({
        title: "Login failed",
        description: "Invalid email or password for the selected role.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
    
    // Pre-fill the email field based on the selected role
    const defaultEmail = value === 'patient' ? 'patient@example.com' : 'insurer@example.com';
    form.setValue('email', defaultEmail);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg animate-scale-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="patient" className="w-full mb-6" onValueChange={handleRoleChange}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="insurer">Insurer</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          {...field} 
                          type="email"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your password" 
                          {...field}
                          type="password"
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Sign in</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>Demo Accounts:</p>
              <p className="font-mono text-xs mt-1">
                Patient: patient@example.com / password
              </p>
              <p className="font-mono text-xs">
                Insurer: insurer@example.com / password
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
