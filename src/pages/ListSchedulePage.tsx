
import ScheduleList from "@/components/ScheduleList";
import { ScheduleProvider } from "@/context/ScheduleContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";

const ListSchedulePage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("ListSchedulePage mounted");
  }, []);
  
  return (
    <ScheduleProvider>
      <div className="min-h-screen p-6 bg-gray-50">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="mr-1" /> Back
        </Button>
        
        <div className="w-full max-w-6xl mx-auto">
          <ScheduleList />
        </div>
      </div>
    </ScheduleProvider>
  );
};

export default ListSchedulePage;
