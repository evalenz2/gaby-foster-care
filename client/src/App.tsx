import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "./pages/HomePage";
import PetDetailPage from "./pages/PetDetailPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AddEditPetPage from "./pages/admin/AddEditPetPage";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Router() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/pet/:id" component={PetDetailPage} />
      <Route path="/login" component={LoginPage} />
      {isAdmin && <Route path="/admin" component={DashboardPage} />}
      {isAdmin && <Route path="/admin/pet" component={AddEditPetPage} />}
      {isAdmin && <Route path="/admin/pet/:id" component={AddEditPetPage} />}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
