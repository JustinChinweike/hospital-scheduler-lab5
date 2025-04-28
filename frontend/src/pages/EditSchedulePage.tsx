import { useParams } from "react-router-dom";
import EditScheduleForm from "@/components/EditScheduleForm";
import SelectScheduleToEdit from "@/components/SelectScheduleToEdit";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const EditSchedulePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="mr-1" /> Back
      </Button>
      
      <div className="max-w-4xl mx-auto">
        {id ? <EditScheduleForm /> : <SelectScheduleToEdit />}

      </div>
    </div>
  );
};

export default EditSchedulePage;
