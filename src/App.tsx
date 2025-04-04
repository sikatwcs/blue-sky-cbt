import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/utils/auth";
import { ProtectedRoute } from "@/utils/routes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ExamList from "./pages/ExamList";
import ExamPage from "./pages/ExamPage";
import QuestionerDashboard from "./pages/QuestionerDashboard";
import FreeTryoutForm from "./pages/FreeTryoutForm";
import QuestionerLogin from "./pages/QuestionerLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pusat-langganan" 
              element={
                <ProtectedRoute>
                  <ExamList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exam/:examId" 
              element={
                <ProtectedRoute>
                  <ExamPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/questioner" 
              element={
                <ProtectedRoute allowedRoles={['questioner']}>
                  <QuestionerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/free-tryout" 
              element={
                <ProtectedRoute>
                  <FreeTryoutForm />
                </ProtectedRoute>
              } 
            />
            <Route path="/questioner/login" element={<QuestionerLogin />} />
            <Route 
              path="/questioner/dashboard" 
              element={
                <ProtectedRoute>
                  <QuestionerDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
