// import React, { useState } from "react";
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";

// import Chatbot from "react-chatbot-kit";
// import 'react-chatbot-kit/build/main.css';

// import config from "./chatbot/config";
// import MessageParser from "./chatbot/MessageParser";
// import ActionProvider from "./chatbot/ActionProvider";
// import ChatIcon from "./chatbot/ChatIcon"; // Make sure this exists!
// const API_URL = import.meta.env.VITE_API_URL;

// const formData = new FormData();
// const res = await fetch(`${API_URL}/predict`, {
//   method: "POST",
//   body: formData
// });


// const queryClient = new QueryClient();

// const App = () => {
//   const [showChatbot, setShowChatbot] = useState(false);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Index />} />
//             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
          
//         {/* Floating Chatbot Launcher Icon */}
//         <div
//           style={{
//             position: "fixed",
//             right: "32px",
//             bottom: showChatbot ? "400px" : "32px", // Move up when open
//             zIndex: 2000,
//             cursor: "pointer",
//             transition: "bottom 0.2s",
//           }}
//           onClick={() => setShowChatbot(prev => !prev)}
//           aria-label="Open chatbot"
//         >
//           <ChatIcon size={56} />
//         </div>

//         {/* Chatbot Panel */}
//         {showChatbot && (
//           <div
//             style={{
//               position: "fixed",
//               right: "32px",
//               bottom: "32px",
//               zIndex: 2000,
//               maxWidth: "340px",
//               boxShadow: "0 8px 32px rgba(44,98,255,0.23)",
//               borderRadius: "16px",
//               background: "white",
//               transition: "all 0.3s",
//             }}
//           >
//             <Chatbot
//               config={config}
//               messageParser={MessageParser}
//               actionProvider={ActionProvider}
//               headerText="HeartBot AI Chat"
//             />
//           </div>
//         )}
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// };

// export default App;
import React, { useState } from "react";
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
import ChatIcon from "./chatbot/ChatIcon"; 

// ✅ Keep Only This
const API_URL = import.meta.env.VITE_API_URL;

// ✅ New function (safe API call)
export async function predictHeartDisease(formData) {
  try {
    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData
    });

    return await res.json();
  } catch (error) {
    console.error("Prediction API error:", error);
    return { error: "API Failed" };
  }
}

const queryClient = new QueryClient();

const App = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <div
          style={{
            position: "fixed",
            right: "32px",
            bottom: showChatbot ? "400px" : "32px",
            zIndex: 2000,
            cursor: "pointer",
            transition: "bottom 0.2s",
          }}
          onClick={() => setShowChatbot(prev => !prev)}
          aria-label="Open chatbot"
        >
          <ChatIcon size={56} />
        </div>

        {showChatbot && (
          <div
            style={{
              position: "fixed",
              right: "32px",
              bottom: "32px",
              zIndex: 2000,
              maxWidth: "340px",
              boxShadow: "0 8px 32px rgba(44,98,255,0.23)",
              borderRadius: "16px",
              background: "white",
              transition: "all 0.3s",
            }}
          >
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              headerText="HeartBot AI Chat"
            />
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

