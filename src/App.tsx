
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Game from "./pages/Game";
import Rules from "./pages/Rules";
import Config from "./pages/Config";
import Setup from "./pages/Setup";
import Distribution from "./pages/Distribution";
import MusicAdmin from "./pages/MusicAdmin";
import NotFound from "./pages/NotFound";

// Create a client outside of the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" enableSystem={false}>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/game" element={<Game />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/config" element={<Config />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/distribution" element={<Distribution />} />
              <Route path="/music-admin" element={<MusicAdmin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
