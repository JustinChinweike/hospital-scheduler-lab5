
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import { ScheduleProvider } from "@/context/ScheduleContext";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  useEffect(() => {
    // Welcome message
    toast({
      title: "Welcome to Hospital Scheduling System",
      description: "Manage appointments efficiently with our scheduling solution",
    });
  }, []);

  return (
    <ScheduleProvider>
      <div className="min-h-screen p-6 flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full flex items-center justify-center">
            <Navigation />
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img 
              src="/lovable-uploads/aa5b8ae9-c4ad-4648-aa72-a068c34fb7e4.png" 
              alt="Hospital scheduling" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </ScheduleProvider>
  );
};

export default Index;
