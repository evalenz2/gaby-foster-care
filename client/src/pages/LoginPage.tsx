import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { loginWithEmail } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Form validation schema
const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    try {
      await loginWithEmail(data.email, data.password);
      toast({
        title: "Login successful",
        variant: "default",
      });
      navigate("/admin");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to log in";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full space-y-8">
          <CardContent className="pt-8">
            <div className="text-center">
              <i className="fas fa-paw text-primary text-5xl mb-4"></i>
              <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access the admin dashboard
              </p>
            </div>
          
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Email address" 
                          autoComplete="email" 
                          disabled={isLoading} 
                          {...field} 
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
                          type="password" 
                          placeholder="Password" 
                          autoComplete="current-password" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                            disabled={isLoading} 
                          />
                        </FormControl>
                        <FormLabel className="text-sm cursor-pointer">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary-dark">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full relative" 
                  disabled={isLoading}
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <i className={`fas fa-lock ${isLoading ? "opacity-50" : "text-primary-light group-hover:text-white"}`}></i>
                  </span>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
