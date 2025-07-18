
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import AdminRoutes from "./pages/AdminRoutes";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/Performance/ErrorBoundary";
import ConditionalGoogleAnalytics from "./components/Analytics/ConditionalGoogleAnalytics";
import SkipLinks from "./components/Accessibility/SkipLinks";
import CookieBanner from "./components/GDPR/CookieBanner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <BrowserRouter>
              <SkipLinks />
              <ConditionalGoogleAnalytics trackingId="G-XXXXXXXXXX" />
              <div className="min-h-screen bg-background font-sans antialiased">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-use" element={<TermsOfUse />} />
                  <Route path="/admin/*" element={<AdminRoutes />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
                <CookieBanner />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
