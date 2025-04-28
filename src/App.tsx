// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AddSchedulePage from "./pages/AddSchedulePage";
import EditSchedulePage from "./pages/EditSchedulePage";
import ListSchedulePage from "./pages/ListSchedulePage";
import NotFound from "./pages/NotFound";
import { ScheduleProvider } from "@/context/ScheduleContext"; // ✅ Add this
import { OfflineProvider } from '@/context/OfflineContext';
import { NetworkStatus } from "@/components/NetworkStatus";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <OfflineProvider>
      <TooltipProvider>
        <ScheduleProvider>
          <Toaster />
          <Sonner />
          <NetworkStatus />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/add-schedule" element={<AddSchedulePage />} />
              <Route path="/edit-schedule" element={<EditSchedulePage />} />
              <Route path="/edit-schedule/:id" element={<EditSchedulePage />} />
              <Route path="/list-schedule" element={<ListSchedulePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ScheduleProvider>
      </TooltipProvider>
    </OfflineProvider>
  </QueryClientProvider>
);

export default App;
