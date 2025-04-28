import { useEffect } from "react";
import Navigation from "@/components/Navigation";
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
    <div className="min-h-screen p-6 flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full flex items-center justify-center">
          <Navigation />
        </div>
      </div>
    </div>
  );
};

export default Index;
