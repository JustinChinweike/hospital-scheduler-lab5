import * as React from "react";
import AddScheduleForm from "../components/AddScheduleForm";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AddSchedulePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-blue-50">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate("/")}
      >
        <ChevronLeft className="mr-1" /> Back
      </Button>

      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full flex items-center justify-center">
          <AddScheduleForm />
        </div>
      </div>
    </div>
  );
};

export default AddSchedulePage;