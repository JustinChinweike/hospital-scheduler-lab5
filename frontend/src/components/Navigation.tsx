
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center my-6">HOSPITAL SCHEDULING MANAGEMENT</h1>
      
      <Button 
        className="bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg uppercase"
        onClick={() => navigate("/add-schedule")}
      >
        ADD SCHEDULE
      </Button>
      
      <Button 
        className="bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg uppercase"
        onClick={() => navigate("/edit-schedule")}
      >
        EDIT SCHEDULE
      </Button>
      
      <Button 
        className="bg-blue-900 hover:bg-blue-800 text-white py-6 text-lg uppercase"
        onClick={() => navigate("/list-schedule")}
      >
        LIST SCHEDULE & FILTERING
      </Button>
    </div>
  );
};

export default Navigation;
