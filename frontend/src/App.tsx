import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import Chatbot from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css';

import config from "./chatbot/config";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        maxWidth: '340px',
      }}>
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
          headerText="HeartBot AI Chat"
        />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
